import {
  SnapBalances,
  SnapNetworks,
  SnapDelegations,
} from './../../../metamaskState';

export interface ChainSliceState {
  networks: SnapNetworks;
  balances: SnapBalances;
  delegations: SnapDelegations;
  isLoading: boolean;
}
