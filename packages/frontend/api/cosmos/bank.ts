import { getChainRestEndpoint } from '@consensys/star-fox-sdk';
import { Pagination } from '../pagination';
import axios, { AxiosResponse } from 'axios';

const GET_ALL_BALANCES_BY_ADDRESS = (restEndpoint: string, address: string) =>
  `${restEndpoint}/cosmos/bank/v1beta1/balances/${address}`;

const GET_ADDRESS_BALANCE_BY_DENOM = (
  restEndpoint: string,
  address: string,
  denom: string
) => `${restEndpoint}/cosmos/bank/v1beta1/balances/${address}/${denom}`;

export interface BalancesResponse {
  balances: Array<{
    denom: string;
    amount: string;
  }>;
  pagination: {
    next_key: string;
    total: string;
  };
}

export interface BalanceResponse {
  balance: {
    denom: string;
    amount: string;
  };
}

export const getBalancesByAddress = async (
  chainName: string,
  address: string,
  pagination: Pagination
): Promise<BalancesResponse> => {
  const response: AxiosResponse = await axios.get(
    GET_ALL_BALANCES_BY_ADDRESS(getChainRestEndpoint(chainName), address),
    {
      params: pagination,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
  );

  const balances: BalancesResponse = response.data;

  return balances;
};

export const getBalanceByAddressAndDenom = async (
  chainName: string,
  address: string,
  denom: string
): Promise<BalanceResponse> => {
  const response: AxiosResponse = await axios.get(
    GET_ADDRESS_BALANCE_BY_DENOM(
      getChainRestEndpoint(chainName),
      address,
      denom
    )
  );

  const balances: BalanceResponse = response.data;

  return balances;
};
