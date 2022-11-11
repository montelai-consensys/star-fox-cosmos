import { Coin, StdFee } from '@cosmjs/amino';
import Joi from 'joi';

export interface IBCTransferPayload {
  senderAddress: string;
  recipientAddress: string;
  transferAmount: Coin;
  sourcePort: string;
  sourceChannel: string;
  timeoutHeight?: number;
  timeoutTimestamp?: number;
  fee: number | StdFee | 'auto';
  memo?: string;
}

export const ibcTransferSchema = Joi.object({
  senderAddress: Joi.string().required(),
  recipientAddress: Joi.string().required(),
  transferAmount: Joi.object({
    denom: Joi.string().required(),
    amount: Joi.string().required(),
  }),
  sourcePort: Joi.string().required(),
  sourceChannel: Joi.string().required(),
  timeoutHeight: Joi.object({}).optional(),
  timeoutTimestamp: Joi.number().optional(),
  fee: [Joi.number(), Joi.valid(['auto']), Joi.object({})],
});
