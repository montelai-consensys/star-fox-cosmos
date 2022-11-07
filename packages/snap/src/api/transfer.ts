import { MetamaskState, validateNetwork } from '../../../sdk/src/index';
import { coin, coins, GasPrice } from '@cosmjs/launchpad';
import { TransferPayload } from '../types';
import { SnapProvider } from '@metamask/snap-types';
import { getSigningClient } from './getSigningClient';
import { StdFee } from '@cosmjs/amino';

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
    state.currentChain.chain_name
  );

  const transferAmount = coins(
    transferPayload.amount,
    state.currentChain.denom
  );

  //simulate

  //estimate gas

  const transfer = await client.sendTokens(
    state.currentAddress,
    transferPayload.recipient,
    transferAmount,
    {
      amount: [{ denom: 'uosmo', amount: '500' }],
      gas: '200000',
    },
    transferPayload.memo
  );
  console.log(transfer);

  return transfer;
}
