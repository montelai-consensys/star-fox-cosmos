import { Chain, Asset } from '@chain-registry/types';
import {
  AssetWithBalance,
  FormattedChain,
  FormattedChainWithAddress,
} from './metamaskState';

export interface ChainSliceState {
  chain: Record<string, FormattedChainWithAddress>;
  balances: Record<string, Record<string, AssetWithBalance>>;
}
