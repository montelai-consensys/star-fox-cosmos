import { siteConfig } from '../config/siteConfig';

export const invokeHello = async (ethereumProvider: any) => {
  return await ethereumProvider.request({
    method: 'wallet_invokeSnap',
    params: [
      siteConfig.snapId,
      {
        method: 'hello',
      },
    ],
  });
};

export const invokeSendToken = async (ethereumProvider: any) => {
  return await ethereumProvider.request({
    method: 'wallet_invokeSnap',
    params: [
      siteConfig.snapId,
      {
        method: 'starFoxSnap_transfer',
        params: {
          chainName: 'osmosis',
          recipient: 'osmo1q47uh5e2v8gfr3efy03xs9m0qrz3d2g2fpdc7l',
          amount: '1',
        },
      },
    ],
  });
};

export const getBalance = async (
  ethereumProvider: any,
  chainName: string,
  address: string,
  denom: string
) => {
  const balanceQuery = {
    chainName,
    address,
    denom,
  };

  return await ethereumProvider.request({
    method: 'wallet_invokeSnap',
    params: [
      siteConfig.snapId,
      {
        method: 'starFoxSnap_getBalance',
        params: balanceQuery,
      },
    ],
  });
};

export const resetAccount = async (ethereumProvider: any) => {
  return await ethereumProvider.request({
    method: 'wallet_invokeSnap',
    params: [
      siteConfig.snapId,
      {
        method: 'starFoxSnap_reset',
        params: {
          RESET: true,
          seed: 'spin fan rule honey index carpet style basket final inquiry arrow action',
        },
      },
    ],
  });
};
