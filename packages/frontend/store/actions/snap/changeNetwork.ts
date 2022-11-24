import { ChangeNetworkPayload } from '@consensys/star-fox-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { siteConfig } from '../../../config/siteConfig';
import { getWalletProvider } from '../../../connector/metamask';
import { changeNetwork } from '../../slices/snap.slice';

interface ChangeNetworkActionParam {
  chainId: string;
}

export const changeNetworkAction = createAsyncThunk(
  'actions/snap/changeNetwork',
  async (changeNetworkActionParam: ChangeNetworkActionParam, thunkAPI) => {
    const flask = await getWalletProvider();
    const { chainId } = changeNetworkActionParam;
    console.debug(
      `[changeNetworkAction] Changing to ${chainId}`,
      changeNetworkActionParam
    );

    const changeNetworkResponse = (await flask.request({
      method: 'wallet_invokeSnap',
      params: [
        siteConfig.snapId,
        {
          method: 'starFoxSnap_changeNetwork',
          params: { chainId },
        },
      ],
    })) as ChangeNetworkPayload;

    const changeNetworkPayload: ChangeNetworkPayload = changeNetworkResponse;
    console.log(111, changeNetworkPayload);

    thunkAPI.dispatch(changeNetwork(changeNetworkPayload));

    console.debug(`[changeNetworkAction] response`, changeNetworkPayload);
    return changeNetworkPayload;
  }
);
