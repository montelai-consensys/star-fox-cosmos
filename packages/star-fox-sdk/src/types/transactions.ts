export type Transactions = Record<string, Array<Transaction>>;

export interface Transaction {
  txHash: string;
  height: string;
  codespace: string;
  code: number;
  data: string;
  logs: Array<Log>;
  block: string;
  gasWanted: string;
  gasUsed: string;
  tx: TransactionData;
}

export interface TransactionData {
  '@type': string;
  body: any;
}

export interface Log {}
