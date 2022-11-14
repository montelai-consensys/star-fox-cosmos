import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';

export function getChain(chainName: string): Chain {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  return chain as Chain;
}

export function validateNetwork(chainName: string) {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  if (!chain) throw new Error(`Unknown chain name ${chainName}`);
}

export function getNetworkRpc(chainName: string): string {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  const rpcs = chain!.apis!.rpc;
  if (!rpcs)
    throw new Error(
      `[getNetworkRpc] Unable to find rpcs for chain ${chainName}`
    );

  //randomizing the rpc used
  const rpcUrl = rpcs[Math.floor(Math.random() * rpcs.length)].address;
  console.debug(`[Get Network Rpc] ${chainName}: ${rpcUrl}`);

  return rpcUrl;
}

export function getChainRestEndpoint(chainName: string): string {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  const restEndpoints = chain!.apis!.rest;
  if (!restEndpoints)
    throw new Error(
      `[getChainRestEndpoint] Unable to find rpcs for chain ${chainName}`
    );

  //randomizing the rpc used
  const restEndpoint = `http://localhost:8081/${
    restEndpoints[Math.floor(Math.random() * restEndpoints.length)].address
  }`;
  console.debug(`[Get Network Rpc] ${chainName}: ${restEndpoint}`);

  return restEndpoint;
}
