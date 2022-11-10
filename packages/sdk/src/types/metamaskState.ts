import { SnapTransactions } from './transactions';
import { Asset, AssetDenomUnit } from '@chain-registry/types';

export interface CurrentChain {
  currentChain: string;
  currentAddress: string;
}

export interface MetamaskState extends CurrentChain {
  networks: SnapNetworks;
  balances: SnapBalances;
  delegations: SnapDelegations;
  transactions: SnapTransactions;
  publicKey: string;
}

export interface ChainFee {
  denom: string;
  fixed_min_gas_price?: number;
  low_gas_price?: number;
  average_gas_price?: number;
  high_gas_price?: number;
}

export interface FormattedChain {
  chain_name: string;
  chain_id: string;
  website: string | null;
  network_type: string;
  bech32_prefix: string;
  rpc: Array<string>;
  rest: Array<string>;
  fees: ChainFee;
  denom: string;
  symbol: string;
  staked: string | number;
  rewards: string | number;
}

export interface FormattedChainWithAddress extends FormattedChain {
  address: string;
}

export interface AssetWithBalance {
  type_asset?: string;
  address?: string;
  base: string;
  name: string;
  decimal: number;
  symbol: string;
  balance: string | number;
}

export interface CurrentChainsAndBalances {
  networks: SnapNetworks;
  balances: SnapBalances;
  delegations: SnapDelegations;
  address: string;
}

export interface Delegation {
  delegator_address: string;
  shares: string;
  validator_address: string;
}

export type SnapNetworks = Record<string, FormattedChainWithAddress>;
export type SnapBalances = Record<string, SnapSingleNetworkBalances>;
export type SnapDelegations = Record<string, Array<Delegation>>;
export type SnapSingleNetworkBalances = Record<string, AssetWithBalance>;
