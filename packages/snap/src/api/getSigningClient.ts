import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import { MetamaskState } from '@consensys/star-fox-sdk';
import { SnapProvider } from '@metamask/snap-types';

export async function getSigningClient(
  wallet: SnapProvider,
  state: MetamaskState,
  chainId: string
) {
  const cosmosNode = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "118'", "0'", '0', '0'],
      curve: 'secp256k1',
    },
  });

  const hdWallet = await DirectSecp256k1Wallet.fromKey(
    Buffer.from(cosmosNode['privateKey'], 'hex'),
    state.networks[chainId].bech32_prefix
  );
  const proxy = 'http://localhost:8082';
  const rpc = `${proxy}/https://rpc-test.osmosis.zone/`;

  const client = await SigningStargateClient.connectWithSigner(
    {
      url: rpc,
      headers: {
        //'Content-Type': 'application/json',
        'Access-Control-Allow-Headers':
          'Accept,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With',
        'Access-Control-Methods': 'GET, POST, OPTION',
        'Access-Control-Allow-Origin': 'https://metamask.github.io',
        'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
        'Access-Control-Max-Age': '1728000',
      },
    },
    hdWallet
  );

  return client;
}
