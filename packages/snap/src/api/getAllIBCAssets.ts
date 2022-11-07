import { getIbcAssets } from '@chain-registry/utils';
import { assets, ibc } from 'chain-registry';
import { validateNetwork } from '../../../sdk/src/index';

export function getAllIBCAssetsByChain(chainName: string): Array<{
  chain_name: string;
  assets: any;
}> {
  validateNetwork(chainName);

  const ibcList = ibc.filter(
    ({ chain_2: { chain_name } }) => chain_name === chain_name
  );
  const symbols = [];
  ibcList.forEach((ibc) => {
    if (chainName === ibc.chain_1.chain_name) {
      symbols.push(ibc.chain_2.chain_name);
    } else if (chainName === ibc.chain_2.chain_name) {
      symbols.push(ibc.chain_1.chain_name);
    }
  });
  const assetList = assets.filter((asset) =>
    symbols.includes(asset.chain_name)
  );

  const ibcAssets = getIbcAssets(chainName, ibcList, assetList);

  return ibcAssets;
}
