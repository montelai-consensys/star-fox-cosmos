import { FormattedChain, MetamaskState } from './metamaskState';

export interface BalanceQuery {
  address: string;
  denom: string;
  chainId: string;
}

export interface BalanceQueryResponse {
  amount: string;
  denom: string;
}

export interface ChangeNetworkQuery {
  chainId: string;
}

export type ChangeNetworkQueryResponse = [MetamaskState, ChangeNetworkPayload];

export interface ChangeNetworkPayload {
  network: FormattedChain;
  address: string;
}
