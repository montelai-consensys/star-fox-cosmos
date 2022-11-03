import { OnRpcRequestHandler, SnapProvider } from '@metamask/snap-types';
import { MetamaskState } from '@consensys/star-fox-sdk';
declare const wallet: SnapProvider;

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state: MetamaskState = (await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  })) as MetamaskState;

};
