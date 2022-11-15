import joi from 'joi';
import Long from 'long';

export interface TransferPayload {
  chainId: string;
  recipient: string;
  amount: string;
  fee;
  memo;
}

export interface IBCTransferPayload extends TransferPayload {
  sourcePort: string;
  sourceChannel: string;
  timeoutHeight: {
    revisionNumber: Long;
    /** the height within the given revision */
    revisionHeight: Long;
  };
  timeoutTimeStamp: number;
}

export const transferPayloadSchema = joi.object({
  recipient: joi.string().required(),
  amount: joi.string().required(),
  fee: joi.string().required(),
  memo: joi.string().optional,
});

export const ibcTransferPayloadSchema = joi.object({
  recipient: joi.string().required(),
  amount: joi.string().required(),
  fee: joi.string().required(),
  memo: joi.string().optional,
  sourcePort: joi.string().required(),
  sourceChannel: joi.string().required(),
  timeoutHeight: joi.object({
    revisionNumber: joi.number().unsafe().required(),
    revisionHeight: joi.number().unsafe().required(),
  }),
  timeoutTimeStamp: joi.number().required(),
});
