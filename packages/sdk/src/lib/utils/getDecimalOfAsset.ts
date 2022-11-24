import { assets, chains } from 'chain-registry';
import { Asset } from '@chain-registry/types';

export const getDecimalOfAsset = (
  chainId: string,
  assetName: string
): number => {
  const chainName = chains.find(
    (chain) => chain.chain_id == chainId
  )!.chain_name;
  const assetList: Array<Asset> = assets.find(
    (asset) => asset.chain_name === chainName
  )!.assets;

  const asset = assetList.find((asset) => asset.symbol === assetName);
  const decimal = asset!.denom_units.find(
    (denom) => denom.denom.toLowerCase() === assetName.toLowerCase()
  )!.exponent;

  return decimal;
};
