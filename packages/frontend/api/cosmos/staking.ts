import { getChainRestEndpoint } from '@consensys/star-fox-sdk';
import axios, { AxiosResponse } from 'axios';
import { Pagination } from '../pagination';

export interface DelegationsResponse {
  delegation_responses: Array<{
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string;
    };
    balance: {
      denom: string;
      amount: string;
    };
  }>;
  pagination: {
    next_key: string;
    total: string;
  };
}

export interface UnbondingDelegationsResponse {
  unbonding_responses: Array<{
    delegator_address: string;
    validator_address: string;
    entries: [
      {
        creation_height: string;
        completion_time: string;
        initial_balance: string;
        balance: string;
      }
    ];
  }>;
  pagination: {
    next_key: string;
    total: string;
  };
}

export interface Reward {
  amount: string;
  denom: string;
}

export interface TotalRewardsResponse {
  rewards: Array<{ validator_address: string; reward: Array<Reward> }>;
  total: Array<Reward>;
}

export const GET_ALL_DELEGATIONS_BY_DELEGATOR = (
  restEndpoint: string,
  delegatorAddress: string
) => `${restEndpoint}/cosmos/staking/v1beta1/delegations/${delegatorAddress}`;

export const GET_UNBONDING_DELEGATIONS_BY_DELEGATOR = (
  restEndpoint: string,
  delegatorAddress: string
) =>
  `${restEndpoint}/cosmos/staking/v1beta1/delegations/${delegatorAddress}/unbonding_delegations`;

export const GET_REWARDS_BY_DELEGATOR = (
  restEndpoint: string,
  delegatorAddress: string
) =>
  `${restEndpoint}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards`;

export const getDelegationsByAddress = async (
  chainId: string,
  delegatorAddress: string,
  pagination: Pagination
): Promise<DelegationsResponse> => {
  const response: AxiosResponse = await axios.get(
    GET_ALL_DELEGATIONS_BY_DELEGATOR(
      getChainRestEndpoint(chainId),
      delegatorAddress
    ),
    { params: pagination }
  );

  const delegations: DelegationsResponse = response.data;

  return delegations;
};

export const getUnbondingDelegationsByAddress = async (
  chainId: string,
  delegatorAddress: string,
  pagination: Pagination
): Promise<UnbondingDelegationsResponse> => {
  const response: AxiosResponse = await axios.get(
    GET_UNBONDING_DELEGATIONS_BY_DELEGATOR(
      getChainRestEndpoint(chainId),
      delegatorAddress
    ),
    { params: pagination }
  );

  const unbondingDelegations: UnbondingDelegationsResponse = response.data;

  return unbondingDelegations;
};

export const getRewardsByAddress = async (
  chainId: string,
  delegatorAddress: string
): Promise<TotalRewardsResponse> => {
  const response: AxiosResponse = await axios.get(
    GET_REWARDS_BY_DELEGATOR(getChainRestEndpoint(chainId), delegatorAddress)
  );

  const totalRewards = response.data;

  return totalRewards;
};
