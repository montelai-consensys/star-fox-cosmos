import {
  Key,
  KeyDto,
  MetamaskState,
  ChangeNetworkQuery,
  FormattedChainWithAddress,
} from '@consensys/star-fox-sdk';
import { SnapProvider } from '@metamask/snap-types';
import { changeNetwork } from './changeNetwork';

export const getKey = async (
  wallet: SnapProvider,
  state: MetamaskState,
  chainId: { chainId: string }
): Promise<KeyDto> => {
  if (chainId.chainId !== state.currentChain) {
    const changeNetworkResponse = await changeNetwork(wallet, state, {
      chainName: chainId.chainId,
    });
    state = changeNetworkResponse[0];
  }

  const network: FormattedChainWithAddress = state[state.currentChain];

  const keyDto: KeyDto = {
    chainId: network.chain_id,
    name: state.currentChain,
    algo: network.symbol,
    bech32Address: state.currentAddress,
    base64Address: state.publicKey,
    base64PubKey: state.publicKey,
    isNanoLedger: false,
  };

  return keyDto;
};
