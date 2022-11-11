import { IBCTransferPayload } from '../../action/tendermint/ibc-transfer';
import { TransferPayload } from '../../action/tendermint/transfer';

export interface TendermintSliceState {
  transfer: TransferPayload;
  ibcTransfer: IBCTransferPayload;
}
