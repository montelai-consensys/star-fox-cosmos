import { MetamaskState, validateNetwork } from '../../../sdk/src/index';
import { coin, coins, GasPrice } from '@cosmjs/launchpad';
import { TransferPayload } from '../types';
import { SnapProvider } from '@metamask/snap-types';
import { getSigningClient } from './getSigningClient';
import { StdFee } from '@cosmjs/amino';
import { showConfirmationDialog } from '../utils/confirmation';
import { DeliverTxResponse } from '@cosmjs/stargate';

export async function sendTransfer(
  wallet: SnapProvider,
  state: MetamaskState,
  transferPayload: TransferPayload
): Promise<DeliverTxResponse> {
  console.debug(`[Transfer]`, transferPayload);
  validateNetwork(transferPayload.chainId);
  const client = await getSigningClient(wallet, state, transferPayload.chainId);

  const denom = state.networks[transferPayload.chainId].denom;
  const transferAmount = coins(transferPayload.amount, denom);

  //simulate

  //estimate gas
  const confirmation = await showConfirmationDialog(wallet, {
    prompt: 'Confirm Transfer',
    description: `Chain: ${transferPayload.chainId}`,
    textAreaContent: `To: ${transferPayload.recipient}\n From: ${
      state.networks[transferPayload.chainId].address
    }\nAmount: ${transferPayload.amount} \nMemo: ${transferPayload.memo}`,
  });

  if (!confirmation) {
    throw new Error('Signer has rejected');
  }

  const transfer: DeliverTxResponse = await client.sendTokens(
    state.currentAddress,
    transferPayload.recipient,
    transferAmount,
    {
      amount: [{ denom: denom, amount: '500' }],
      gas: '200000',
    },
    transferPayload.memo
  );

  console.log(transfer);

  return transfer;
}
