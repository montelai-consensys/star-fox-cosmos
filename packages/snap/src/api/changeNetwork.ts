import {
  ChangeNetworkQuery,
  ChangeNetworkQueryResponse,
  MetamaskState,
  formatChain,
  getChain,
  validateNetwork,
} from '../../../sdk/src/index';
import { pubkeyToAddress } from '@cosmjs/amino';
import { SnapProvider } from '@metamask/snap-types';

export async function changeNetwork(
  wallet: SnapProvider,
  state: MetamaskState,
  params: ChangeNetworkQuery
): Promise<ChangeNetworkQueryResponse> {
  console.debug('[Change Network]', params);
  const { chainName } = params;
  validateNetwork(chainName);
  const chain = getChain(chainName);

  if (!chain) throw new Error(`[Change Network] Unknown chain ${chainName}`);

  const formattedChain = formatChain(chain);

  console.debug('[Change Network]');
  console.debug(formattedChain);

  //update address
  const chainAddress = pubkeyToAddress(
    {
      type: 'tendermint/PubKeySecp256k1',
      value: state.publicKey,
    },
    chain.bech32_prefix
  );

  const formattedChainWithAddress = {
    ...formattedChain,
    address: chainAddress,
  };

  const updatedState: MetamaskState = {
    ...state,
    networks: {
      ...state.networks,
      [formattedChainWithAddress.chain_name]: formattedChainWithAddress,
    },
    transactions: {
      ...state.transactions,
      [formattedChainWithAddress.chain_name]: [
        ...(state.transactions?.[formattedChainWithAddress.chain_name]
          ? state.transactions[formattedChainWithAddress.chain_name]
          : []),
      ],
    },
    currentChain: chainName,
    currentAddress: chainAddress,
  };

  await wallet.request({
    method: 'snap_manageState',
    params: ['update', updatedState],
  });

  return [
    updatedState,
    {
      network: formattedChain,
      address: chainAddress,
    },
  ];
}
