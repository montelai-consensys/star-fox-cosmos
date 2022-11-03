import { Transactions } from './transactions';
import { Chain } from '@chain-registry/types';

export type MetamaskState = {
  currentChain: Chain;
  currentAddress: string;
  balance: string; //cosmos chains returns balances as string because of possible int overflow
  networks: Record<string, Chain>;
  transactions: Transactions;
  //seed: string;
  pk: string;
};
