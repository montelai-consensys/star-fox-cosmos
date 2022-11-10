import { ChangeNetworkPayload } from '@consensys/star-fox-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { siteConfig } from '../../../config/siteConfig';
import { getWalletProvider } from '../../../connector/metamask';
import { changeNetwork } from '../../slices/snap.slice';

export const setCurrentNetworkAction = createAsyncThunk(
  'actions/snap/setNetwork',
  async (_, thunkAPI) => {
    const flask = await getWalletProvider();
    console.debug(`[setNetworkAction] Initializing`);

    const currentNetwork = (await flask.request({
      method: 'wallet_invokeSnap',
      params: [
        siteConfig.snapId,
        {
          method: 'snap_getCurrentNetwork',
        },
      ],
    })) as ChangeNetworkPayload;

    thunkAPI.dispatch(changeNetwork(currentNetwork));

    console.debug(`[setNetworkAction] response`, currentNetwork);
    return currentNetwork;
  }
);
