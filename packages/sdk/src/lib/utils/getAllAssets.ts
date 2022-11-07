import {
  getAssetLists,
  getIbcAssets,
  getCw20Assets,
} from '@chain-registry/utils';
import { chains, assets, ibc as ibcList } from 'chain-registry';
import { Asset } from '@chain-registry/types';
import { SnapBalances, SnapSingleNetworkBalances } from '../../types';

export const getSnapSingleNetworkBalances = (
  chainName: string
): SnapSingleNetworkBalances => {
  const assetListResult: Array<{ assets: Array<Asset>; chain_name: string }> =
    getAssetLists(chainName, ibcList, assets);
  if (assetListResult.length === 0)
    throw new Error(`Unable to get all assets of ${chainName}`);

  const assetList = assetListResult?.[0].assets;
  const balances: SnapSingleNetworkBalances = {};

  assetList.forEach(
    (asset) =>
      (balances[asset.symbol] = {
        ...asset,
        balance: '0',
      })
  );

  return balances;
};

export const getAllNetworkBalances = (): SnapBalances => {
  const snapBalances: SnapBalances = {};
  chains.forEach(
    (chain) =>
      (snapBalances[chain.chain_name] = getSnapSingleNetworkBalances(
        chain.chain_name
      ))
  );

  return snapBalances;
};
