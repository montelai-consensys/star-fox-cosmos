import { SigningStargateClient } from '@cosmjs/stargate';
import { MetamaskState } from '../../../sdk/src/index';
import { coins, GasPrice } from '@cosmjs/launchpad';
import { IBCTransferPayload, ibcTransferPayloadSchema } from '../types';

export async function sendIBCTransfer(
  state: MetamaskState,
  client: SigningStargateClient,
  ibcTransferPayload: IBCTransferPayload
) {
  try {
    const value = await ibcTransferPayloadSchema.validateAsync(
      ibcTransferPayload
    );
  } catch (err) {
    console.debug(
      `[IBC Transfer] ${state.currentChain.chain_id}: IBC schema error ${ibcTransferPayload}`
    );
  }

  const transferAmount = coins(
    ibcTransferPayload.amount,
    state.currentChain.denom
  )[0];

  const transfer = await client.sendIbcTokens(
    state.currentAddress,
    ibcTransferPayload.recipient,
    transferAmount,
    ibcTransferPayload.sourcePort,
    ibcTransferPayload.sourceChannel,
    ibcTransferPayload.timeoutHeight,
    ibcTransferPayload.timeoutTimeStamp,
    ibcTransferPayload.fee
  );
}
