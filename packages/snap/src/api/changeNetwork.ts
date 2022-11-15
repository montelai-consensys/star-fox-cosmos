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
  const { chainId } = params;
  validateNetwork(chainId);
  const chain = getChain(chainId);

  if (!chain) throw new Error(`[Change Network] Unknown chain ${chainId}`);

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
      [formattedChainWithAddress.chain_id]: formattedChainWithAddress,
    },
    transactions: {
      ...state.transactions,
      [formattedChainWithAddress.chain_id]: [
        ...(state.transactions?.[formattedChainWithAddress.chain_id]
          ? state.transactions[formattedChainWithAddress.chain_id]
          : []),
      ],
    },
    currentChainId: chainId,
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
