import { MetamaskState } from '@consensys/star-fox-sdk';
import { pubkeyToAddress } from '@cosmjs/amino';
import { SnapProvider } from '@metamask/snap-types';
import { getChain, validateNetwork } from '../utils/networkChecker';

export async function changeNetwork(
  wallet: SnapProvider,
  state: MetamaskState,
  params: { chainName: string }
) {
  console.debug('[Change Network]', params);
  const { chainName } = params;
  //if (state.currentChain.chain_name === chainName) return; //network is the same
  validateNetwork(chainName);
  const chain = getChain(chainName);

  //update address
  const newPk = pubkeyToAddress(
    {
      type: 'tendermint/PubKeySecp256k1',
      value: state.pk,
    },
    chain.bech32_prefix
  );

  const updatedState: MetamaskState = {
    ...state,
    networks: {
      ...state.networks,
      [chainName]: chain,
    },
    transactions: {
      ...state.transactions,
      [chainName]: [
        ...(state.transactions[chainName] ? state.transactions[chainName] : []),
      ],
    },
    currentChain: chain,
    currentAddress: newPk,
  };

  console.debug(updatedState);

  await wallet.request({
    method: 'snap_manageState',
    params: ['update', updatedState],
  });
}
