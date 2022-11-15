import { pubkeyToAddress } from '@cosmjs/amino';
import { chains } from 'chain-registry';
import { FormattedChainWithAddress, SnapNetworks } from '../../types';
import { formatChain } from './formatChain';
import { getChain } from './networkChecker';

export const getAllNetworks = (base64PublicKey: string): SnapNetworks => {
  const snapNetworks: SnapNetworks = {};
  for (let i = 0; i < chains.length; i++) {
    try {
      snapNetworks[chains[i].chain_id] = generateChainWithAddress(
        chains[i].chain_id,
        base64PublicKey
      );
    } catch (e) {
      console.debug(
        `[getAllNetworks] Unable to get chain ${chains[i].chain_id}`
      );
    }
  }

  return snapNetworks;
};

const generateChainWithAddress = (
  chainId: string,
  base64PublicKey: string
): FormattedChainWithAddress => {
  const chain = formatChain(getChain(chainId));
  const address = pubkeyToAddress(
    {
      type: 'tendermint/PubKeySecp256k1',
      value: base64PublicKey,
    },
    chain.bech32_prefix
  );

  const chainWithAddress = { ...chain, address, staked: '0', rewards: '0' };

  return chainWithAddress;
};
