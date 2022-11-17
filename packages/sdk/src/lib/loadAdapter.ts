import { MetamaskTendermintOfflineSigner } from './adapter';

declare let window: any;

export const loadMetamaskFlask = async (chainId: string) => {
  if (!window.ethereum) {
    throw new Error('Metamask is not installed');
  }

  const installed = localStorage.getItem('snapInstalled');
  if (!installed) {
    await window.ethereum.request({
      method: 'wallet_enable',
      params: [
        {
          wallet_snap: { 'local:http://localhost:8080/': { version: '*' } },
          eth_accounts: {},
        },
      ],
    });
    localStorage.setItem('snapInstalled', 'true');
  }

  const { currentChainId } = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      'local:http://localhost:8080/',
      {
        method: 'starFoxSnap_getCurrentNetwork',
        params: {
          chainId,
        },
      },
    ],
  });

  if (chainId !== currentChainId) {
    console.log('Swiching Network to', chainId);
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        'local:http://localhost:8080/',
        {
          method: 'starFoxSnap_changeNetwork',
          params: {
            chainId,
          },
        },
      ],
    });
  }

  const signer = new MetamaskTendermintOfflineSigner(
    window.ethereum,
    'local:http://localhost:8080/'
  );

  return signer;
};
