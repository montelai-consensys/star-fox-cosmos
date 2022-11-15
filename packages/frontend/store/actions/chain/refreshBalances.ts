import { createAsyncThunk } from '@reduxjs/toolkit';
import { BalanceQuery } from '@consensys/star-fox-sdk';
import { getBalancesByAddress } from 'packages/frontend/api/cosmos';
import { Pagination } from 'packages/frontend/api/pagination';
import { updateBalance } from '../../slices/chain.slice';

export const refreshBalanceAction = createAsyncThunk(
  'actions/chains/refreshBalance',
  async (balanceQuery: BalanceQuery, thunkAPI) => {
    const { chainId, address } = balanceQuery;
    console.debug(
      `[refreshBalanceAction] Getting balances for ${chainId} ${address}`
    );

    const balances = await getBalancesByAddress(
      chainId,
      address, //'osmo1qc99y4t293llhaukk6lq74cq8ul38e9djqyrlu',
      {} as Pagination
    );

    thunkAPI.dispatch(
      updateBalance({
        chainId,
        assets: balances.balances,
      })
    );

    console.debug(`[refreshBalanceAction] Completed`, balances);

    return balances;
  }
);
