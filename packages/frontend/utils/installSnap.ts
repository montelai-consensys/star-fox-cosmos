import { MetaMaskInpageProvider } from '@metamask/providers';
import { siteConfig } from '../config/siteConfig';

export const installSnap = async (provider: MetaMaskInpageProvider) => {
  const walletEnableResult = await provider.request({
    method: 'wallet_enable',
    // This entire object is ultimately just a list of requested permissions.
    // Every snap has an associated permission or permissions, given the prefix `wallet_snap_`
    // and its ID. Here, the `wallet_snap` property exists so that callers don't
    // have to specify the full permission permission name for each snap.
    params: [
      {
        wallet_snap: { [siteConfig.snapId]: { version: '*' } },
        eth_accounts: {},
      },
    ],
  });

  console.debug(
    `[Install Snap] Installed ${siteConfig.snapId} Version ${siteConfig.snapVersion}`
  );

  localStorage.setItem(
    'snapInstalled',
    JSON.stringify({
      id: siteConfig.snapId,
      installed: true,
    })
  );

  return walletEnableResult;
};
