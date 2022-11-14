import { OnRpcRequestHandler, SnapProvider } from '@metamask/snap-types';
import {
  getBalance,
  sendTransfer,
  changeNetwork,
  sendIBCTransfer,
} from './api';
import {
  BalanceQuery,
  ChangeNetworkQuery,
  IBCTransferPayload,
  MetamaskState,
  SignAminoPayload,
  SignDirectPayload,
  TransferPayload,
} from '@consensys/star-fox-sdk';
//} from '../../sdk/src/index';
import {
  showConfirmationDialog,
  ConfirmationDialogContent,
} from './utils/confirmation';
import { initializeAccount } from './cosmos/initializeAccount';
import { signDirect } from './api/signDirect';
import { getCurrentState } from './utils/getCurrentState';
import { signAmino } from './api/signAmino';

declare const wallet: SnapProvider;

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state: MetamaskState = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MetamaskState;

  console.log(`[Origin] ${origin}`);
  console.debug(`Current State`, state);

  if (!state) {
    console.debug(`State not found, reinitializing`);
    state = await initializeAccount(wallet);
  }

  switch (request.method) {
    case 'hello':
      const message: ConfirmationDialogContent = {
        prompt: 'Hello Ping',
        description: 'This is a ping message',
      };
      return await showConfirmationDialog(wallet, message);

    // IMPLEMENTATION OF OFFLINE DIRECT SIGNER AND OFFLINE AMINO SIGNER
    case 'starFoxSnap_getAccount':
      console.debug('[getAccount] Starting');
      return {
        address: state.currentAddress,
        algo: 'secp256k1',
        pubkey: state.publicKey,
      };
    case 'starFoxSnap_signDirect':
      console.debug('[signDirect] Starting');

      const response = await signDirect(
        wallet,
        state,
        request.params as unknown as SignDirectPayload
      );
      return response;
    case 'starFoxSnap_signAmino':
      console.debug('[signAmino] Starting');
      const response = await signAmino(
        wallet,
        state,
        request.params as SignAminoPayload
      );
      return;

    // Convenience Methods of snap
    case 'starFoxSnap_getChainsAndBalances':
      console.debug('[getChainsAndBalances] Starting');

      return getCurrentState(state);
    case 'starFoxSnap_getCurrentNetwork':
      console.debug('[getCurrentNetwork] Starting');

      return {
        currentChain: state.currentChain,
        currentAddress: state.currentAddress,
      };
    case 'starFoxSnap_addNetwork':
      console.debug('[addNetwork] Starting');

      return;
    case 'starFoxSnap_changeNetwork':
      console.debug('[changeNetwork] Starting');

      const [_, networkChangePayload] = await changeNetwork(
        wallet,
        state,
        request.params as unknown as ChangeNetworkQuery
      );
      return networkChangePayload;
    case 'starFoxSnap_updateRpc':
      console.debug('[updateRpc] Starting');

      return;
    case 'starFoxSnap_getAddress':
      console.debug('[getAddress] Starting');

      const pk = state.currentAddress;
      return pk;
    case 'starFoxSnap_getBalance':
      console.debug('[getBalance] Starting');

      return await getBalance(request.params as unknown as BalanceQuery);
    case 'starFoxSnap_transfer':
      console.debug('[transfer] Starting');

      const transferResult = await sendTransfer(
        wallet,
        state,
        request.params as TransferPayload
      );
      return transferResult;
    case 'starFoxSnap_ibcTransfer':
      console.debug('[ibcTransfer] Starting');

      return await sendIBCTransfer(
        wallet,
        state,
        request.params as IBCTransferPayload
      );
    case 'starFoxSnap_signTransactionAndBroadcast':
      console.debug('[signTransactionandBroadcast] Starting');

      return;
    case 'starFoxSnap_getTransactionsByNetwork':
      console.debug('[getTransactionsByNetwork] Starting');

      return;
    case 'starFoxSnap_reset':
      console.debug('[reset] Starting');

      console.log('Resetting state');
      return await wallet.request({
        method: 'snap_manageState',
        params: ['clear'],
      });
    default:
      throw new Error('Method not found.');
  }
};
