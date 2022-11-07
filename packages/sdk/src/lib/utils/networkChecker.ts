import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';

export function getChain(chainName: string): Chain {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  return chain;
}

export function validateNetwork(chainName: string) {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  if (!chain) throw new Error(`Unknown chain name ${chainName}`);
}

export async function getNetworkRpc(chainName: string) {
  const chain = chains.find(({ chain_name }) => chain_name === chainName);
  const rpcs = chain.apis.rpc;
  //randomizing the rpc used
  const rpcUrl = rpcs[Math.floor(Math.random() * rpcs.length)].address;
  console.debug(`[Get Network Rpc] ${chainName}: ${rpcUrl}`);

  return rpcUrl;
}
