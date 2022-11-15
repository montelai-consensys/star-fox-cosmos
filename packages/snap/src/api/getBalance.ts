import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { createProtobufRpcClient, QueryClient } from '@cosmjs/stargate';
import { QueryClientImpl } from 'cosmjs-types/cosmos/bank/v1beta1/query';
import { getAllIBCAssetsByChain } from './getAllIBCAssets';
import {
  BalanceQueryResponse,
  BalanceQuery,
  getNetworkRpc,
} from '../../../sdk/src/index';

export async function getBalance(
  balanceQuery: BalanceQuery
): Promise<BalanceQueryResponse> {
  console.debug('[GetBalance] Query', balanceQuery);
  const { address, denom, chainId }: BalanceQuery = balanceQuery;
  console.log('IBC Assets', getAllIBCAssetsByChain(chainId));
  const rpcUrl = await getNetworkRpc(chainId);

  //create read only client
  const tendermint = await Tendermint34Client.connect(rpcUrl);
  const queryClient = new QueryClient(tendermint);
  const rpcClient = createProtobufRpcClient(queryClient);
  const bankQueryService = new QueryClientImpl(rpcClient);

  const { balance } = await bankQueryService.Balance({
    address,
    denom,
  });

  console.debug(`Returned balance: ${balance.amount} ${balance.denom}`);

  return balance;
}
