import { MetamaskState, validateNetwork } from '../../../sdk/src/index';
import { coin, coins, GasPrice } from '@cosmjs/launchpad';
import { TransferPayload } from '../types';
import { SnapProvider } from '@metamask/snap-types';
import { getSigningClient } from './getSigningClient';
import { StdFee } from '@cosmjs/amino';
import { showConfirmationDialog } from '../utils/confirmation';

export async function sendTransfer(
  wallet: SnapProvider,
  state: MetamaskState,
  transferPayload: TransferPayload
) {
  console.debug(`[Transfer]`, transferPayload);
  validateNetwork(transferPayload.chainName);
  const client = await getSigningClient(
    wallet,
    state,
    transferPayload.chainName
  );

  const denom = state.networks[transferPayload.chainName].denom;
  const transferAmount = coins(transferPayload.amount, denom);

  //simulate

  //estimate gas
  const confirmation = await showConfirmationDialog(wallet, {
    prompt: 'Confirm Transfer',
    description: `Chain: ${transferPayload.chainName}`,
    textAreaContent: `To: ${transferPayload.recipient}\n From: ${
      state.networks[transferPayload.chainName].address
    }\nAmount: ${transferPayload.amount} \nMemo: ${transferPayload.memo}`,
  });

  if (!confirmation) {
    throw new Error('Signer has rejected');
  }

  const transfer = await client.sendTokens(
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
