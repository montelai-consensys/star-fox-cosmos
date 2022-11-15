import { BalanceQuery, BalanceQueryResponse } from '@consensys/star-fox-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { siteConfig } from '../../../config/siteConfig';
import { getWalletProvider } from '../../../connector/metamask';
import { getBalance } from '../../slices/snap.slice';

export const getBalanceAction = createAsyncThunk(
  'actions/snaps/getBalance',
  async (getBalanceAction: BalanceQuery, thunkAPI) => {
    const flask = await getWalletProvider();
    const { chainId, address, denom } = getBalanceAction;

    console.debug(
      `[getBalanceAction] Getting balance for ${address} on chain ${chainId}`,
      getBalanceAction
    );

    const balanceQueryResponse = (await flask.request({
      method: 'wallet_invokeSnap',
      params: [
        siteConfig.snapId,
        {
          method: 'starFoxSnap_getBalance',
          params: { chainId, address, denom },
        },
      ],
    })) as BalanceQueryResponse;
    thunkAPI.dispatch(getBalance(balanceQueryResponse));
  }
);
