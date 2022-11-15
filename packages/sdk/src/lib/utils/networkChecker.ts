import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';

export function getChain(chainId: string): Chain {
  const chain = chains.find(({ chain_id }) => chain_id === chainId);
  return chain as Chain;
}

export function validateNetwork(chainId: string) {
  const chain = getChain(chainId);
  if (!chain) throw new Error(`Unknown chain id ${chainId}`);
}

export function getNetworkRpc(chainId: string): string {
  const chain = chains.find(({ chain_id }) => chain_id === chainId);
  const rpcs = chain!.apis!.rpc;
  if (!rpcs)
    throw new Error(`[getNetworkRpc] Unable to find rpcs for chain ${chainId}`);

  //randomizing the rpc used
  const rpcUrl = rpcs[Math.floor(Math.random() * rpcs.length)].address;
  console.debug(`[Get Network Rpc] ${chainId}: ${rpcUrl}`);

  return rpcUrl;
}

export function getChainRestEndpoint(chainId: string): string {
  const chain = getChain(chainId);
  const restEndpoints = chain!.apis!.rest;
  if (!restEndpoints)
    throw new Error(
      `[getChainRestEndpoint] Unable to find rpcs for chain ${chainId}`
    );

  //randomizing the rpc used
  const restEndpoint = `http://localhost:8081/${
    restEndpoints[Math.floor(Math.random() * restEndpoints.length)].address
  }`;
  console.debug(`[Get Network Rpc] ${chainId}: ${restEndpoint}`);

  return restEndpoint;
}
