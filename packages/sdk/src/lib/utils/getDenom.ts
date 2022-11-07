import { Asset } from '@chain-registry/types';
import { assets } from 'chain-registry';

export function getDenom(chainName: string): Asset {
  //assumption is the first asset is the native token. there are chains with native stable coins
  const assetList = assets.find(({ chain_name }) => chain_name === chainName);
  const baseAsset = assetList!.assets?.[0];
  return baseAsset;
}
