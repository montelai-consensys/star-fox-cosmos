import { OnRpcRequestHandler, SnapProvider } from '@metamask/snap-types';
import { getBalance, sendTransfer, changeNetwork } from './api';
import {
  BalanceQuery,
  ChangeNetworkQuery,
  MetamaskState,
  SignAminoPayload,
  SignDirectPayload,
} from '@consensys/star-fox-sdk';
import {
  showConfirmationDialog,
  ConfirmationDialogContent,
} from './utils/confirmation';
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
    console.log(state);
  }
  console.debug(`Current State`, state);
  switch (request.method) {
    case 'hello':
      const message: ConfirmationDialogContent = {
        prompt: 'Hello Ping',
        description: 'This is a ping message',
      };
      return await showConfirmationDialog(wallet, message);
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
    default:
      throw new Error('Method not found.');
  }
};
