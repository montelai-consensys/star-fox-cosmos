export interface Votes {
  proposal_id: string;
  voter: string;
  option: VoteType;
}

export enum VoteType {
  VOTE_OPTION_UNSPECIFIED,
  VOTE_OPTION_YES,
  VOTE_OPTION_ABSTAIN,
  VOTE_OPTION_NO,
  VOTE_OPTION_NO_WITH_VETO,
}
