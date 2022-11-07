import { pubkeyToAddress } from '@cosmjs/amino';
import {
  MetamaskState,
  getAllNetworkBalances,
  getChain,
  formatChain,
} from '@consensys/star-fox-sdk';
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
  const cosmoshub = formatChain(getChain('cosmoshub'));
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

  const cosmosWithAddress = { ...cosmoshub, address: cosmosAddress };

  const balances = getAllNetworkBalances();
  const transactions = {};
  Object.keys(balances).forEach((chainName) => (transactions[chainName] = []));

  //generate wallets for all supported chains
  const newState: MetamaskState = {
    currentAddress: cosmosAddress,
    currentChain: cosmosWithAddress,
    balance: '0',
    networks: {
      cosmoshub: cosmosWithAddress,
    },
    balances,
    transactions,
    publicKey: base64PublicKey,
  };

  await wallet.request({
    method: 'snap_manageState',
    params: ['update', newState],
  });

  return newState;
}
