import { chains } from 'chain-registry';
import { SnapDelegations } from '../../types';

export const initializeSnapDelegations = (): SnapDelegations => {
  const delegations: SnapDelegations = {};
  chains.forEach((chain) => (delegations[chain.chain_name] = []));
  return delegations;
};
