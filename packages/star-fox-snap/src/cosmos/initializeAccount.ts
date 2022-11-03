import { pubkeyToAddress } from '@cosmjs/amino';
import { MetamaskState } from '@consensys/star-fox-sdk';
import { SnapProvider } from '@metamask/snap-types';
import { getChain } from '../utils/networkChecker';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';

export async function initializeAccount(
  wallet: SnapProvider
): Promise<MetamaskState> {
  const chain = getChain('cosmoshub');
  const cosmosNode = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "118'", "0'", '0', '0'],
      curve: 'secp256k1',
    },
  });

  console.debug('[Chain]', chain);

  const secp256Wallet = await DirectSecp256k1Wallet.fromKey(
    Buffer.from(cosmosNode['privateKey'], 'hex'),
    chain.bech32_prefix
  );
  console.log(await secp256Wallet.getAccounts());

  const cosmosPk = pubkeyToAddress(
    {
      type: 'tendermint/PubKeySecp256k1',
      value: Buffer.from(
        (await secp256Wallet.getAccounts())[0].pubkey
      ).toString('base64'),
    },
    chain.bech32_prefix
  );

  //generate wallets for all supported chains
  const newState: MetamaskState = {
    currentAddress: cosmosPk,
    currentChain: chain,
    balance: '0',
    networks: {
      cosmoshub: chain,
    },
    transactions: {
      cosmoshub: [],
    },
    pk: Buffer.from((await secp256Wallet.getAccounts())[0].pubkey).toString(
      'base64'
    ),
  };

  await wallet.request({
    method: 'snap_manageState',
    params: ['update', newState],
  });

  return newState;
}
