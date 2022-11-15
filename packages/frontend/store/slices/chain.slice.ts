import {
  ChainSliceState,
  FormattedChainWithAddress,
  SnapNetworks,
  SnapBalances,
  BalanceQueryResponse,
  AssetWithBalance,
  SnapDelegations,
  GovernanceProposal,
} from '@consensys/star-fox-sdk';
import { createSlice } from '@reduxjs/toolkit';
import { chains } from 'chain-registry';
import { AppState } from '../store';

const populateProposals = (): Record<string, Array<GovernanceProposal>> => {
  const proposals = {};
  chains.forEach((chain) => {
    proposals[chain.chain_name] = [];
  });

  return proposals;
};

const initialState: ChainSliceState = {
  networks: {},
  balances: {},
  delegations: {},
  proposals: populateProposals(),
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
        chainId,
        assets,
      }: { chainId: string; assets: Array<BalanceQueryResponse> } =
        action.payload;

      console.debug(`[updateBalance] Updating balance for ${chainId}`, assets);

      assets.forEach((asset) => {
        const chainBalance: Array<AssetWithBalance> = Object.values(
          state.balances[chainId]
        );
        const balance = chainBalance.find(
          (balance) => balance.base === asset.denom
        );
        console.log(`[updateBalance]`, balance);
        if (balance) {
          state.balances[chainId][balance['symbol']] = {
            ...state.balances[chainId][balance['symbol']],
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
      const { chainId, stakes, totalStake } = action.payload;
      console.debug(`[updateStakes] total ${totalStake}`);
      state.delegations[chainId] = stakes;
      state.networks[chainId].staked = totalStake;

      return state;
    },
    updateRewards(state: ChainSliceState, action) {
      console.debug(`[updateRewards] Updating rewards`, action.payload);
      const { chainId, reward } = action.payload;
      state.networks[chainId].rewards = reward;
      return state;
    },
    updateGovernanceProposalByChain(state: ChainSliceState, action) {
      console.debug(`[updateGovernanceProposalByChain] Updating proposals`);
      const { chainId, proposals } = action.payload;
      state.proposals[chainId] = proposals;
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
  updateGovernanceProposalByChain,
} = chainSlice.actions;

export const selectChains = (state: AppState): SnapNetworks =>
  state.chains.networks;
export const selectChainByChainId = (chainId: string) => (state: AppState) => {
  return state.chains.networks[chainId];
};

export const selectBalances = (state: AppState): SnapBalances =>
  state.chains.balances;
export const selectBalancesByChainId =
  (chainId: string) => (state: AppState) => {
    return state.chains.balances[chainId];
  };

export const selectDelegations = (state: AppState): SnapDelegations =>
  state.chains.delegations;
export const selectDelegationsByChainId =
  (chainId: string) => (state: AppState) => {
    return state.chains.delegations[chainId];
  };

export const selectChainsAndBalances = (state: AppState) => state.chains;
export const selectChainsAndBalancesByChainId =
  (chainId: string) => (state: AppState) => {
    return {
      balances: state.chains.balances[chainId],
      networks: state.chains.networks[chainId],
    };
  };
export const selectProposals = (state: AppState) => state.chains.proposals;
export const selectProposalsByChainId =
  (chainId: string) => (state: AppState) => {
    return state.chains.proposals[chainId];
  };
