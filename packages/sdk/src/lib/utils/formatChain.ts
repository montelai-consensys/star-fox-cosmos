import { Chain } from '@chain-registry/types';
import { ChainFee, FormattedChain } from 'packages/sdk/src';
import { getDenom } from './getDenom';

export const formatChain = (chain: Chain): FormattedChain => {
  const denom = getDenom(chain.chain_name);
  if (!denom)
    throw new Error(`[Format Chain] Unknown denom for ${chain.chain_name}`);
  const fees: ChainFee = chain.fees?.fee_tokens?.[0]
    ? chain.fees.fee_tokens[0]
    : { denom: denom.base, fixed_min_gas_price: 0 };

  const formattedChain = {
    chain_name: chain.chain_name,
    chain_id: chain.chain_id,
    website: chain.website ? chain.website : null,
    bech32_prefix: chain.bech32_prefix,
    network_type: chain.network_type,
    rpc: chain?.apis?.rpc
      ? chain.apis.rpc.map((rpc) => {
          return rpc.address;
        })
      : [],
    fees,
    denom: denom.base,
  };
  return formattedChain;
};
