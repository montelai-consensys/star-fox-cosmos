import { OnRpcRequestHandler, SnapProvider } from '@metamask/snap-types';
import { getBalance, sendTransfer, changeNetwork } from './api';
import {
  BalanceQuery,
  ChangeNetworkQuery,
  MetamaskState,
  SignAminoPayload,
  SignDirectPayload,
} from '@consensys/star-fox-sdk';
//} from '../../sdk/src/index';
import {
  showConfirmationDialog,
  ConfirmationDialogContent,
} from './utils/confirmation';
import { initializeAccount } from './cosmos/initializeAccount';
import { RequestParam } from './types';
import { signDirect } from './api/signDirect';
import { getCurrentState } from './utils/getCurrentState';

declare const wallet: SnapProvider;

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const requestParams = request.params as unknown as RequestParam;
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
    case 'getAccount':
      return {
        address: state.currentAddress,
        algo: 'secp256k1',
        pubkey: state.publicKey,
      };
    case 'signDirect':
      const response = await signDirect(
        wallet,
        state,
        request.params as unknown as SignDirectPayload
      );
      return response;
    case 'signAmino':
      return;

    // Convenience Methods of snap
    case 'snap_getChainsAndBalances':
      return getCurrentState(state);
    case 'snap_getCurrentNetwork':
      return {
        currentChain: state.currentChain,
        currentAddress: state.currentAddress,
      };
    case 'addNetwork':
      return;
    case 'changeNetwork':
      const [updatedState, networkChangePayload] = await changeNetwork(
        wallet,
        state,
        request.params as unknown as ChangeNetworkQuery
      );
      return networkChangePayload;
    case 'updateRpc':
      return;
    case 'getAddress':
      const pk = state.currentAddress;
      return pk;
    case 'getBalance':
      return await getBalance(request.params as unknown as BalanceQuery);
    case 'transfer':
      const transferResult = await sendTransfer(wallet, state, request.params);
      return transferResult;
    case 'ibc_transfer':
      //return await sendIBCTransfer(state, client, request.params);
      return;
    case 'signTransactionAndBroadcast':
      return;
    case 'getTransactionsByNetwork':
      return;
    case 'user_getAllBalancesByNetwork':
      return;
    case 'reset':
      console.log('Resetting state');
      return await wallet.request({
        method: 'snap_manageState',
        params: ['clear'],
      });
    default:
      throw new Error('Method not found.');
  }
};
