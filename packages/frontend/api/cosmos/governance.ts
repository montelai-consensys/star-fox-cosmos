import axios, { AxiosResponse } from 'axios';
import {
  getChainRestEndpoint,
  GovernanceProposal,
  GovernanceProposalQuery,
  GovernanceProposalsResponse,
  Votes,
  VoteType,
  Pagination,
  PaginationResponse,
  Tally,
  TallyResponse,
  SingleGovernanceProposalResponse,
  ProposalVoteResponse,
} from '@consensys/star-fox-sdk';

const GET_ALL_GOVERNANCE_PROPOSALS = (restEndpoint: string) =>
  `${restEndpoint}/cosmos/gov/v1beta1/proposals`;
const GET_PROPOSAL_DETAILS_BY_ID = (restEndpoint: string, proposalId: string) =>
  `${GET_ALL_GOVERNANCE_PROPOSALS(restEndpoint)}/${proposalId}`;
const GET_PROPOSAL_TALLY = (restEndpoint: string, proposalId: string) =>
  `${GET_PROPOSAL_DETAILS_BY_ID(restEndpoint, proposalId)}/tally`;
const GET_PROPOSAL_VOTES = (restEndpoint: string, proposalId: string) =>
  `${GET_PROPOSAL_DETAILS_BY_ID(restEndpoint, proposalId)}/votes`;

export const getGovernanceProposals = async (
  governanceProposalQuery: GovernanceProposalQuery
): Promise<GovernanceProposalsResponse> => {
  try {
    const response: AxiosResponse = await axios.get(
      GET_ALL_GOVERNANCE_PROPOSALS(
        getChainRestEndpoint(governanceProposalQuery.chainId)
      ),
      {
        params: governanceProposalQuery.paginationParams,
      }
    );

    const proposals: GovernanceProposalsResponse = response.data;
    return proposals;
  } catch (e) {
    console.debug(`['getGovernanceProposal'] Failed to get proposals`, e);
    throw e;
  }
};

export const getGovernanceProposalById = async (
  chainName: string,
  proposalId: string
): Promise<GovernanceProposal> => {
  try {
    const response: AxiosResponse = await axios.get(
      GET_PROPOSAL_DETAILS_BY_ID(getChainRestEndpoint(chainName), proposalId)
    );

    const singleGovernanceProposal: SingleGovernanceProposalResponse =
      response.data;
    return singleGovernanceProposal.proposal;
  } catch (e) {
    console.debug(
      `['getGovernanceProposal'] Failed to get proposal with id ${proposalId}`,
      e
    );
    throw e;
  }
};

export const getProposalTally = async (
  chainName: string,
  proposalId: string
): Promise<Tally> => {
  try {
    const respose: AxiosResponse = await axios.get(
      GET_PROPOSAL_TALLY(getChainRestEndpoint(chainName), proposalId)
    );

    const tallyResponse: TallyResponse = respose.data;

    return tallyResponse.tally;
  } catch (e) {
    console.debug(
      `['getProposalTally'] Failed to get proposal tally with id ${proposalId}`,
      e
    );
    throw e;
  }
};

export const getProposalVotes = async (
  chainName: string,
  proposalId: string
): Promise<ProposalVoteResponse> => {
  try {
    const response: AxiosResponse = await axios.get(
      GET_PROPOSAL_VOTES(getChainRestEndpoint(chainName), proposalId)
    );

    const votesResponse: ProposalVoteResponse = response.data;

    return votesResponse;
  } catch (e) {
    console.debug(
      `['getProposalVotes'] Failed to get proposal votes with id ${proposalId}`,
      e
    );
    throw e;
  }
};
