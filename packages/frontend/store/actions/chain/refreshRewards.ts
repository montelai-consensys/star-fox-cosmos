import { createAsyncThunk } from '@reduxjs/toolkit';
import { BalanceQuery } from '@consensys/star-fox-sdk';
import { getRewardsByAddress } from 'packages/frontend/api/cosmos';
import { updateRewards } from '../../slices/chain.slice';

export const refreshRewardsAction = createAsyncThunk(
  'actions/chains/refreshRewards',
  async (balanceQuery: BalanceQuery, thunkAPI) => {
    const { chainId, address } = balanceQuery;
    console.debug(
      `[refreshRewardsAction] Getting rewards for ${chainId} ${address}`
    );

    const rewardsResponse = await getRewardsByAddress(
      chainId,
      address //'osmo1qc99y4t293llhaukk6lq74cq8ul38e9djqyrlu'
    );

    const totalRewards =
      rewardsResponse.total.length > 0 ? rewardsResponse.total[0].amount : '0';

    thunkAPI.dispatch(
      updateRewards({
        chainId,
        reward: totalRewards,
      })
    );

    console.debug(`[refreshRewardsAction] Completed`, totalRewards);

    return totalRewards;
  }
);
