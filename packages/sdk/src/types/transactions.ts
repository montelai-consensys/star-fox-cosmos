import { StdFee, StdSignature } from '@cosmjs/amino';

export type SnapTransactions = Record<string, Array<Transaction>>;

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

export interface SignAminoDocDto {
  chain_id: string;
  account_number: string;
  sequence: string;
  fee: StdFee;
  msgs: Array<AminoMsgDto>;
  memo: string;
}

export interface AminoMsgDto {
  type: string;
  value: string; //utin8array
}

export interface SignDocDto {
  bodyBytes: string; //uint8array
  chainId: string;
  accountNumber: string; // Long
  authInfoBytes: string; //uint8array
}

export interface SignDirectPayload {
  signDocDto: SignDocDto;
  signerAddress: string;
}

export interface SignAminoPayload {
  signDocDto: SignAminoDocDto;
  signerAddress: string;
}

export interface SignatureDto {
  signature: string;
  pubKey: {
    type: string;
    value: string; // Uint8Array as string
  };
}

export interface SignAminoResponseDto {
  signDocDto: SignAminoDocDto;
  signature: SignatureDto;
}

export interface SignDirectResponseDto {
  signDocDto: SignDocDto;
  signature: SignatureDto;
}
