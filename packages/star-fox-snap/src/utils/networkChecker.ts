import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';

export function getChain(chainName: string): Chain {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  return chain;
}

