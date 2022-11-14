import { DeliverTxResponse, SigningStargateClient } from '@cosmjs/stargate';
import { MetamaskState } from '../../../sdk/src/index';
import { coin, GasPrice } from '@cosmjs/launchpad';
import { IBCTransferPayload, ibcTransferPayloadSchema } from '../types';
import { SnapProvider } from '@metamask/snap-types';
import { getSigningClient } from './getSigningClient';
import { showConfirmationDialog } from '../utils/confirmation';

export async function sendIBCTransfer(
  wallet: SnapProvider,
  state: MetamaskState,
  ibcTransferPayload: IBCTransferPayload
): Promise<DeliverTxResponse> {
  const { error } = await ibcTransferPayloadSchema.validateAsync(
    ibcTransferPayload
  );
  if (error) {
    console.debug(
      `[IBC Transfer] ${state.currentChain}: IBC schema error`,
      error
    );
  }
  const client = await getSigningClient(
    wallet,
    state,
    ibcTransferPayload.chainName
  );

  const transferAmount = coin(
    ibcTransferPayload.amount,
    state.networks[ibcTransferPayload.chainName].denom
  );

  //estimate gas
  const confirmation = await showConfirmationDialog(wallet, {
    prompt: 'Confirm IBC Transfer',
    description: `Chain: ${ibcTransferPayload.chainName}`,
    textAreaContent: `To: ${ibcTransferPayload.recipient}\nFrom: ${
      state.networks[ibcTransferPayload.chainName].address
    }\nAmount: ${ibcTransferPayload.amount}\nSource Channel: ${
      ibcTransferPayload.sourceChannel
    }\nSource Port: ${ibcTransferPayload.sourcePort}`,
  });

  if (!confirmation) {
    throw new Error('Signer has rejected');
  }

  const ibcTransfer: DeliverTxResponse = await client.sendIbcTokens(
    state.currentAddress,
    ibcTransferPayload.recipient,
    transferAmount,
    ibcTransferPayload.sourcePort,
    ibcTransferPayload.sourceChannel,
    ibcTransferPayload.timeoutHeight,
    ibcTransferPayload.timeoutTimeStamp,
    ibcTransferPayload.fee
  );

  console.log(`[IBC Transfer] Result`, ibcTransfer);

  return ibcTransfer;
}
