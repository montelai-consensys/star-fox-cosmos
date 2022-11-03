import { OnRpcRequestHandler, SnapProvider } from '@metamask/snap-types';
import { MetamaskState } from '@consensys/star-fox-sdk';
import {
  showConfirmationDialog,
  ConfirmationDialogContent,
} from './utils/confirmation';
declare const wallet: SnapProvider;

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state: MetamaskState = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MetamaskState;

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
    default:
      throw new Error('Method not found.');
  }
};
