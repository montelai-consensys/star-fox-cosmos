import { BalanceQuery, BalanceQueryResponse } from '@consensys/star-fox-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { siteConfig } from '../../../config/siteConfig';
import { getWalletProvider } from '../../../connector/metamask';
import { getBalance } from '../../slices/snap.slice';

export const getBalanceAction = createAsyncThunk(
  'actions/snaps/getBalance',
  async (getBalanceAction: BalanceQuery, thunkAPI) => {
    const flask = await getWalletProvider();
    const { chainName, address, denom } = getBalanceAction;

    console.debug(
      `[getBalanceAction] Getting balance for ${address} on chain ${chainName}`,
      getBalanceAction
    );

    const balanceQueryResponse = (await flask.request({
      method: 'wallet_invokeSnap',
      params: [
        siteConfig.snapId,
        {
          method: 'getBalance',
          params: { chainName, address, denom },
        },
      ],
    })) as BalanceQueryResponse;
    thunkAPI.dispatch(getBalance(balanceQueryResponse));
  }
);
