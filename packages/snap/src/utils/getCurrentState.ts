import {
  CurrentChainsAndBalances,
  MetamaskState,
  SnapBalances,
  SnapNetworks,
} from '../../../sdk/src/index';

export const getCurrentState = (
  state: MetamaskState
): CurrentChainsAndBalances => {
  return {
    networks: state.networks,
    balances: state.balances,
    delegations: state.delegations,
    address: state.currentAddress,
  };
};
