import { Chain, Asset } from '@chain-registry/types';
import { FormattedChain, FormattedChainWithAddress } from './metamaskState';

export interface AssetWithBalance extends Asset {
  balance: string;
}

export interface ChainSliceState {
  chain: Record<string, FormattedChainWithAddress>;
  balances: Record<string, Record<string, AssetWithBalance>>;
}
