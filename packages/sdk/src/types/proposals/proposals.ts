import { Pagination, PaginationResponse } from '../pagination';
import { Votes } from './votes';

export interface GovernanceProposalQuery {
  chainName: string;
  proposal_status: ProposalStatus;
  voter?: string; //address of voter
  depositor?: string; // depositors of the proposals
  paginationParams?: Pagination;
}

export interface GovernanceProposalsResponse {
  proposals: Array<GovernanceProposal>;
  pagination: PaginationResponse;
}

export interface GovernanceProposal {
  proposal_id: string;
  content: {
    '@type': string;
    title: string;
    description: string;
  };
  status: ProposalStatus;
  final_tally_result: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
  submit_time: string;
  deposit_end_time: string;
  total_deposit: [
    {
      denom: string;
      amount: string;
    }
  ];
  voting_start_time: string;
  voting_end_time: string;
}

export enum ProposalStatus {
  UNSPECIFIC = 'PROPOSAL_STATUS_UNSPECIFIED',
  DEPOSIT_PERIOD = 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  VOTING_PERIOD = 'PROPOSAL_STATUS_VOTING_PERIOD',
  PASSED = 'PROPOSAL_STATUS_PASSED',
  REJECTED = 'PROPOSAL_STATUS_REJECTED',
  FAILED = 'PROPOSAL_STATUS_FAILED',
}
export interface ProposalVoteResponse {
  votes: Array<Votes>;
  pagination: PaginationResponse;
}

export interface SingleGovernanceProposalResponse {
  proposal: GovernanceProposal;
}
