import { MetamaskState } from '../../../sdk/src/index';

export const getCurrentState = (state: MetamaskState) => {
  return {
    network: state.currentChain,
    balance: state.balance,
    address: state.currentAddress,
  };
};
