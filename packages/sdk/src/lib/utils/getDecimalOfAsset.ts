import { assets } from 'chain-registry';
import { Asset } from '@chain-registry/types';

export const getDecimalOfAsset = (
  chainName: string,
  assetName: string
): number => {
  const assetList: Array<Asset> = assets.find(
    (asset) => asset.chain_name === chainName
  )!.assets;

  const asset = assetList.find((asset) => asset.symbol === assetName);
  const decimal = asset!.denom_units.find(
    (denom) => denom.denom.toLowerCase() === assetName.toLowerCase()
  )!.exponent;

  return decimal;
};
