import {
  getAssetLists,
  getIbcAssets,
  getCw20Assets,
} from '@chain-registry/utils';
import { chains, assets, ibc as ibcList } from 'chain-registry';
import { Asset, Chain } from '@chain-registry/types';
import { SnapBalances, SnapSingleNetworkBalances } from '../../types';

export const getSnapSingleNetworkBalances = (
  chainId: string
): SnapSingleNetworkBalances => {
  const { chain_name: chainName } = chains.find(
    (chain) => chain.chain_id === chainId
  ) as Chain;
  const assetListResult: Array<{
    assets: Array<Asset>;
    chain_name: string;
  }> = getAssetLists(chainName, ibcList, assets);

  if (assetListResult.length == 0) {
    assetListResult.push({ chain_name: chainName, assets: [] });
  }

  const nativeAssets = assets.find((chain) => chainName === chain.chain_name);
  if (nativeAssets?.assets) {
    assetListResult[0].assets = [
      ...assetListResult[0].assets,
      ...nativeAssets!.assets,
    ];
  }

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

  assetList.forEach((asset) => {
    let uri;
    try {
      const fileType: string = Object.keys(asset.logo_URIs!)[0];
      uri = asset.logo_URIs![
        fileType as keyof typeof asset.logo_URIs
      ] as string;
    } catch (e) {
      uri = null;
    }

    balances[asset.symbol] = {
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
      imageURI: uri as string,
    };
  });

  return balances;
};

export const getAllNetworkBalances = (): SnapBalances => {
  const snapBalances: SnapBalances = {};
  for (let i = 0; i < chains.length; i++) {
    try {
      snapBalances[chains[i].chain_id] = getSnapSingleNetworkBalances(
        chains[i].chain_id
      );
    } catch (e) {
      console.log(chains[i].chain_id, e);
      //console.debug(
      //`[getAllNetworkBalances] Chain ${chains[i].chain_name} is missing assets. Skipping..`
      //);
    }
  }

  return snapBalances;
};

export const getNativeTokenImageURI = (chainId: string): string | undefined => {
  try {
    const { chain_name: chainName } = chains.find(
      (chain) => chain.chain_id === chainId
    ) as Chain;
    const chainAsset = assets.find((chain) => chain.chain_name === chainName);
    const asset: Asset = chainAsset?.assets?.[0] as Asset;
    if (!asset || !asset?.logo_URIs) return undefined;

    const fileType: string = Object.keys(asset.logo_URIs)[0];
    const uri = asset.logo_URIs[
      fileType as keyof typeof asset.logo_URIs
    ] as string;
    return uri;
  } catch (e) {
    console.debug(
      `[getNativeTokenImageUrl] Couldn't find images for chainId ${chainId}`,
      e
    );
    return undefined;
  }
};

export const getTokenImageURI = (
  chainId: string,
  symbol: string
): string | undefined => {
  const { chain_name: chainName } = chains.find(
    (chain) => chain.chain_id === chainId
  ) as Chain;
  const chainAsset = assets.find((chain) => chain.chain_name === chainName);
  const asset: Asset = chainAsset?.assets.find(
    (asset) => asset.symbol.toLowerCase() === symbol.toLowerCase()
  ) as Asset;
  if (!asset || !asset?.logo_URIs) return undefined;

  const fileType: string = Object.keys(asset.logo_URIs)[0];
  const uri = asset.logo_URIs[
    fileType as keyof typeof asset.logo_URIs
  ] as string;
  return uri;
};
