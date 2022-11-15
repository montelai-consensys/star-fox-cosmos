import {
  CurrentChainsAndBalances,
  MetamaskState,
  SnapBalances,
  SnapNetworks,
} from '@consensys/star-fox-sdk';

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
