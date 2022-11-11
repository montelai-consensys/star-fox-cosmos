import {
  ChainSliceState,
  FormattedChainWithAddress,
  SnapNetworks,
  SnapBalances,
  BalanceQueryResponse,
  AssetWithBalance,
  SnapDelegations,
  TendermintSliceState,
  TransferPayload,
  transferPayloadSchema,
  IBCTransferPayload,
  ibcTransferSchema,
} from '@consensys/star-fox-sdk';
import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';

const initialState: TendermintSliceState = {
  transfer: {
    senderAddress: null,
    destinationAddress: null,
    amount: '0',
    memo: null,
    fee: null,
  },
  ibcTransfer: {
    senderAddress: '',
    recipientAddress: '',
    transferAmount: {
      denom: '',
      amount: '',
    },
    sourcePort: null,
    sourceChannel: null,
    timeoutHeight: null,
    timeoutTimestamp: null,
    fee: 'auto',
    memo: null,
  },
};

export const tendermintSlice = createSlice({
  name: 'tendermint',
  initialState,
  reducers: {
    setTransfer(state: TendermintSliceState, action) {
      const transfer = action.payload as TransferPayload;
      const { error } = transferPayloadSchema.validate(transfer);
      if (error) {
        throw new Error(error.message);
      }
      state.transfer = transfer;
    },
    setIBCTransfer(state: TendermintSliceState, action) {
      const ibcTransfer = action.payload as IBCTransferPayload;
      const { error } = ibcTransferSchema.validate(ibcTransfer);
      if (error) {
        throw new Error(error.message);
      }
      state.ibcTransfer = ibcTransfer;
    },
    resetTransfers(state: TendermintSliceState, action) {
      state = initialState;
    },
  },
});

export const { setTransfer, setIBCTransfer, resetTransfers } =
  tendermintSlice.actions;
