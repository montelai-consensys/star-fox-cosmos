import Joi from 'joi';

export interface TransferPayload {
  senderAddress: string;
  destinationAddress: string;
  amount: string;
  memo: string;
  fee: string;
}

export const transferPayloadSchema = Joi.object({
  senderAddress: Joi.string().required(),
  destinationAddress: Joi.string().required(),
  amount: Joi.string()
    .pattern(/^[0-9]+$/, 'numbers')
    .required(),
  memo: Joi.string().optional(),
  fee: Joi.any(),
});
