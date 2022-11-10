import { ChangeNetworkPayload } from '@consensys/star-fox-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CurrentChainsAndBalances } from '../../../../sdk/src';
import { siteConfig } from '../../../config/siteConfig';
import { getWalletProvider } from '../../../connector/metamask';
import { updateCurrentChainsAndBalances } from '../../slices/chain.slice';

export const getChainsAndBalancesAction = createAsyncThunk(
  'actions/chains/updateCurrentChainsAndBalances',
  async (_, thunkAPI) => {
    const flask = await getWalletProvider();
    console.debug(`[getChainsAndBalanceAction] Getting latest state`);

    const currentChainsAndBalances = (await flask.request({
      method: 'wallet_invokeSnap',
      params: [
        siteConfig.snapId,
        {
          method: 'snap_getChainsAndBalances',
        },
      ],
    })) as CurrentChainsAndBalances;

    console.debug(
      `[getChainsAndBalancesAction] response`,
      currentChainsAndBalances
    );

    thunkAPI.dispatch(updateCurrentChainsAndBalances(currentChainsAndBalances));

    return currentChainsAndBalances;
  }
);
