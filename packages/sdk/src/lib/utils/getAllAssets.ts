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

  if (assetListResult.length == 0) {
    assetListResult.push({ chain_name: chainName, assets: [] });
  }

  const nativeAssets = assets.find((chain) => chainName === chain.chain_name);
  assetListResult[0].assets = [
    ...assetListResult[0].assets,
    ...nativeAssets!.assets,
  ];

  //handle for testnets
  if (chainName.includes('testnet')) {
    const testnetAssets = assets.find(
      (asset) => asset.chain_name === chainName
    );
    assetListResult[0].assets = [
      ...assetListResult[0].assets,
      ...testnetAssets!.assets,
    ];
  }

  const assetList = assetListResult?.[0].assets;
  const balances: SnapSingleNetworkBalances = {};

  assetList.forEach(
    (asset) =>
      (balances[asset.symbol] = {
        type_asset: asset.type_asset,
        address: asset.address,
        base: asset.base,
        name: asset.name,
        symbol: asset.symbol,
        //@ts-ignore
        decimal: asset.denom_units.find(
          (denom) => denom.denom === asset.symbol.toLowerCase()
        )?.exponent,
        balance: '0',
      })
  );

  return balances;
};

export const getAllNetworkBalances = (): SnapBalances => {
  const snapBalances: SnapBalances = {};
  for (let i = 0; i < chains.length; i++) {
    try {
      snapBalances[chains[i].chain_name] = getSnapSingleNetworkBalances(
        chains[i].chain_name
      );
    } catch (e) {
      console.log(chains[i].chain_name, e);
      //console.debug(
      //`[getAllNetworkBalances] Chain ${chains[i].chain_name} is missing assets. Skipping..`
      //);
    }
  }

  return snapBalances;
};

export const getTokenImageURI = (chainName: string): string | undefined => {
  const chainAsset = assets.find((chain) => chain.chain_name === chainName);
  const asset: Asset = chainAsset?.assets?.[0] as Asset;
  if (!asset || !asset?.logo_URIs) return undefined;

  const fileType: string = Object.keys(asset.logo_URIs)[0];
  const uri = asset.logo_URIs[
    fileType as keyof typeof asset.logo_URIs
  ] as string;
  return uri;
};
