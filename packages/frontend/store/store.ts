import {
  configureStore,
  ThunkAction,
  Action,
  AnyAction,
  combineReducers,
} from '@reduxjs/toolkit';
import { snapSlice } from './slices/snap.slice';
import { createWrapper } from 'next-redux-wrapper';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { chainSlice } from './slices/chain.slice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { tendermintSlice } from './slices/tendermint.slice';
import { chainApi } from './api/chain/api';

const allReducers = {
  [snapSlice.name]: snapSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [tendermintSlice.name]: tendermintSlice.reducer,
  [chainApi.reducerPath]: chainApi.reducer,
};
const combinedReducer = combineReducers(allReducers);

const reducer: typeof combinedReducer = (state, action: AnyAction) => {
  return combinedReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: { trace: true, traceLimit: 25 },
  // middleware: [thunk],
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([chainApi.middleware]);
  },
});

export const makeStore = () => {
  return store;
};
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const selectAppState = (state: AppState) => state;

export const wrapper = createWrapper<AppStore>(makeStore);
