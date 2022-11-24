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
  const network: FormattedChainWithAddress = state.networks[chainId.chainId];

  const keyDto: KeyDto = {
    chainId: network.chain_id,
    name: 'Star Fox Snap',
    algo: network.symbol,
    bech32Address: state.currentAddress,
    base64Address: state.publicKey,
    base64PubKey: state.publicKey,
    isNanoLedger: false,
  };

  return keyDto;
};
