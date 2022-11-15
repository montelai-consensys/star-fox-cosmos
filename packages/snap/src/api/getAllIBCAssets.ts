import { getIbcAssets } from '@chain-registry/utils';
import { assets, ibc } from 'chain-registry';
import { validateNetwork } from '../../../sdk/src/index';

export function getAllIBCAssetsByChain(chainId: string): Array<{
  chain_name: string;
  chainId: string;
  assets: any;
}> {
  validateNetwork(chainId);
  const chain = getChain(chainId);

  const ibcList = ibc.filter(
    ({ chain_2: { chain_name } }) => chain_name === chain.chain_name
  );
  const symbols = [];
  ibcList.forEach((ibc) => {
    if (chain.chain_name === ibc.chain_1.chain_name) {
      symbols.push(ibc.chain_2.chain_name);
    } else if (chain.chain_name === ibc.chain_2.chain_name) {
      symbols.push(ibc.chain_1.chain_name);
    }
  });
  const assetList = assets.filter((asset) =>
    symbols.includes(asset.chain_name)
  );

  const ibcAssets = getIbcAssets(chain.chain_name, ibcList, assetList).map(
    (assets) => {
      return {
        ...assets,
        chainId,
      };
    }
  );

  return ibcAssets;
}
