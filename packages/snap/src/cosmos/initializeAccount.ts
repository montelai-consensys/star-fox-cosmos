import { pubkeyToAddress } from '@cosmjs/amino';
import {
  MetamaskState,
  getAllNetworkBalances,
  getChain,
  formatChain,
  getAllNetworks,
  initializeSnapDelegations,
} from '../../../sdk/src';
import { SnapProvider } from '@metamask/snap-types';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';

export async function initializeAccount(
  wallet: SnapProvider
): Promise<MetamaskState> {
  const cosmosNode = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "118'", "0'", '0', '0'],
      curve: 'secp256k1',
    },
  });
  const cosmoshub = formatChain(getChain('cosmoshub-4'));
  const secp256Wallet = await DirectSecp256k1Wallet.fromKey(
    Buffer.from(cosmosNode['privateKey'], 'hex'),
    cosmoshub.bech32_prefix
  );

  const base64PublicKey = Buffer.from(
    (await secp256Wallet.getAccounts())[0].pubkey
  ).toString('base64');

  const cosmosAddress = pubkeyToAddress(
    {
      type: 'tendermint/PubKeySecp256k1',
      value: base64PublicKey,
    },
    cosmoshub.bech32_prefix
  );

  console.debug(`Public Key ${base64PublicKey}`);

  const balances = getAllNetworkBalances();
  const transactions = {};
  const networks = getAllNetworks(base64PublicKey);
  Object.keys(networks).forEach((chainName) => (transactions[chainName] = []));
  const delegations = initializeSnapDelegations();

  //generate wallets for all supported chains
  const newState: MetamaskState = {
    currentAddress: cosmosAddress,
    currentChainId: 'cosmoshub-4',
    networks,
    balances,
    transactions,
    delegations,
    publicKey: base64PublicKey,
  };

  //TODO: Investigate the serialization error if we do not reparse state.
  const savedState = await wallet.request({
    method: 'snap_manageState',
    params: ['update', JSON.parse(JSON.stringify(newState))],
  });

  return savedState as MetamaskState;
}
