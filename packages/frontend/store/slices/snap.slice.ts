import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { siteConfig } from '../../config/siteConfig';
import {
  BalanceQueryResponse,
  ChangeNetworkPayload,
  CurrentChain,
  TendermintSnapState,
} from '@consensys/star-fox-sdk';
import { changeNetworkAction } from '../actions/snap/changeNetwork';
import { getBalanceAction } from '../actions/snap/getBalanceAction';
import { AppState } from '../store';

const initialState: TendermintSnapState = {
  snapId: siteConfig.snapId,
  snapVersion: siteConfig.snapVersion,
  currentChainId: null,
  currentAddress: '',
  ready: true,
  actions: {},
};

export const snapSlice = createSlice({
  name: 'snap',
  initialState,
  reducers: {
    changeNetwork(state: TendermintSnapState, action) {
      const { network, address } = action.payload as ChangeNetworkPayload;
      state = {
        ...state,
        currentAddress: address,
        currentChainId: network.chain_id,
      };
      return state;
    },
    getBalance(state: TendermintSnapState, action) {
      const { amount, denom } = action.payload as BalanceQueryResponse;
      state = {
        ...state,
      };
      return state;
    },
    extraReducers: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      [HYDRATE]: (state: TendermintSnapState, action) => {
        console.log(`[HYDRATE]`, state, action);
        return {
          ...state,
        };
      },
    },
  },
  extraReducers(builder) {
    [changeNetworkAction, getBalanceAction].forEach((asyncAction) => {
      builder
        .addCase(asyncAction.pending, (state, action) => {
          state.actions[asyncAction.typePrefix] = {
            processing: true,
            error: null,
            result: null,
          };
        })
        .addCase(asyncAction.fulfilled, (state, action) => {
          state.actions[asyncAction.typePrefix] = {
            processing: false,
            error: null,
            result: action.payload,
          };
        })
        .addCase(asyncAction.rejected, (state, action) => {
          state.actions[asyncAction.typePrefix] = {
            processing: false,
            error: action.error,
            result: null,
          };
        });
    });
  },
});

export const { changeNetwork, getBalance, sendToken, getAddress, getChain } =
  snapSlice.actions;

export const selectSnapState = (state: AppState): TendermintSnapState =>
  state.snap;
export const selectSnapCurrentAddress = (state: AppState): string =>
  state.snap.currentAddress;
