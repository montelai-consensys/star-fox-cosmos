export interface Network {
  networkType: NetworkType;
  chainId: string;
  chainName: string;
  bech32Prefix: string;
  denom: string;
  fixedMinGasPrice?: number;
  rpcUrl: string;
  logo?: string;
  cosmwasm_enabled: boolean;
  cosmwasm_version?: string;
  keyAlgo: Array<string>;
}

export type Networks = Record<string, Network>;

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}
