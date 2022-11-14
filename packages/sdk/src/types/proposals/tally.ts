export interface TallyResponse {
  tally: Tally;
}

export interface Tally {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
}
