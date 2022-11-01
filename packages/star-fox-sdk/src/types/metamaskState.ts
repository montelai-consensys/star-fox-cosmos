import { Network, Networks } from './network';
import { Transactions } from './transactions';

export type MetamaskState = {
  current_network: Network;
  currentAddress: string;
  balance: string; //cosmos chains returns balances as string because of possible int overflow
  networks: Networks;
  transactions: Transactions;
  pubKey: string | null;
};
