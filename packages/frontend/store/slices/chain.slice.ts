import {
  ChainSliceState,
  FormattedChainWithAddress,
  SnapNetworks,
  SnapBalances,
  BalanceQueryResponse,
  AssetWithBalance,
  SnapDelegations,
} from '@consensys/star-fox-sdk';
import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';

const initialState: ChainSliceState = {
  networks: {},
  balances: {},
  delegations: {},
  isLoading: false,
};

export const chainSlice = createSlice({
  name: 'chains',
  initialState,
  reducers: {
    updateCurrentChain(state: ChainSliceState, action) {
      const { chain } = action.payload as { chain: FormattedChainWithAddress };
      state = {
        ...state,
        networks: {
          ...state.networks,
          [chain.chain_name]: chain,
        },
      };
      return state;
    },
    updateBalance(state: ChainSliceState, action) {
      const {
        chainName,
        assets,
      }: { chainName: string; assets: Array<BalanceQueryResponse> } =
        action.payload;

      console.debug(
        `[updateBalance] Updating balance for ${chainName}`,
        assets
      );

      assets.forEach((asset) => {
        const chainBalance = Object.values(state.balances[chainName]);
        const balance = chainBalance.find(
          (balance) => balance.base === asset.denom
        );
        console.log(`[updateBalance]`, balance);
        if (balance) {
          state.balances[chainName][balance['symbol']] = {
            ...state.balances[chainName][balance['symbol']],
            balance: asset.amount,
          };
        } else {
          console.debug(
            `[updateBalance] Unable to update balance ${asset.denom}. Not found in state`
          );
        }
      });
      return state;
    },
    updateCurrentChainsAndBalances(state: ChainSliceState, action) {
      console.log(`[updateCurrentChainsAndBalances]`);
      state = {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload.balances,
        },
        networks: {
          ...state.networks,
          ...action.payload.networks,
        },
      };
      return state;
    },
    updateStakes(state: ChainSliceState, action) {
      console.debug(`[updateStakes] Updating stakes`, action.payload);
      const { chainName, stakes, totalStake } = action.payload;
      console.debug(`[updateStakes] total ${totalStake}`);
      state.delegations[chainName] = stakes;
      state.networks[chainName].staked = totalStake;

      return state;
    },
    updateRewards(state: ChainSliceState, action) {
      console.debug(`[updateRewards] Updating rewards`, action.payload);
      const { chainName, reward } = action.payload;
      state.networks[chainName].rewards = reward;
      return state;
    },
  },
});

export const {
  updateCurrentChain,
  updateBalance,
  updateCurrentChainsAndBalances,
  updateStakes,
  updateRewards,
} = chainSlice.actions;

export const selectChains = (state: AppState): SnapNetworks =>
  state.chains.networks;
export const selectBalances = (state: AppState): SnapBalances =>
  state.chains.balances;
export const selectDelegations = (state: AppState): SnapDelegations =>
  state.chains.delegations;
export const selectChainsAndBalances = (state: AppState) => state.chains;
