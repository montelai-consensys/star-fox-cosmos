import { ChangeNetworkPayload } from '@consensys/star-fox-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { siteConfig } from '../../../config/siteConfig';
import { getWalletProvider } from '../../../connector/metamask';
import { changeNetwork } from '../../slices/snap.slice';

interface ChangeNetworkActionParam {
  chainName: string;
}

export const changeNetworkAction = createAsyncThunk(
  'actions/snap/changeNetwork',
  async (changeNetworkActionParam: ChangeNetworkActionParam, thunkAPI) => {
    const flask = await getWalletProvider();
    const { chainName } = changeNetworkActionParam;
    console.debug(
      `[changeNetworkAction] Changing to ${chainName}`,
      changeNetworkActionParam
    );

    const changeNetworkResponse = (await flask.request({
      method: 'wallet_invokeSnap',
      params: [
        siteConfig.snapId,
        {
          method: 'changeNetwork',
          params: { chainName },
        },
      ],
    })) as ChangeNetworkPayload;

    const changeNetworkPayload: ChangeNetworkPayload = changeNetworkResponse;

    thunkAPI.dispatch(changeNetwork(changeNetworkPayload));

    console.debug(`[changeNetworkAction] response`, changeNetworkPayload);
    return changeNetworkPayload;
  }
);
