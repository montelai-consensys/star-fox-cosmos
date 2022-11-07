import { SnapTransactions } from './transactions';
import { Asset } from '@chain-registry/types';

export interface CurrentChain {
  currentChain: FormattedChainWithAddress;
  currentAddress: string;
  balance: string; //cosmos chains returns balances as string because of possible int overflow
}

export interface MetamaskState extends CurrentChain {
  networks: SnapNetworks;
  balances: SnapBalances;
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
  website: string;
  network_type: string;
  bech32_prefix: string;
  rpc: Array<string>;
  fees: ChainFee;
  denom: string;
}

export interface FormattedChainWithAddress extends FormattedChain {
  address: string;
}

export interface AssetWithBalance extends Asset {
  balance: string | number;
}

export type SnapNetworks = Record<string, FormattedChainWithAddress>;
export type SnapBalances = Record<string, SnapSingleNetworkBalances>;
export type SnapSingleNetworkBalances = Record<string, AssetWithBalance>;
