import {
  SnapBalances,
  SnapNetworks,
  SnapDelegations,
  SnapProposals,
} from './../../../metamaskState';

export interface ChainSliceState {
  networks: SnapNetworks;
  balances: SnapBalances;
  delegations: SnapDelegations;
  proposals: SnapProposals;
  isLoading: boolean;
}
