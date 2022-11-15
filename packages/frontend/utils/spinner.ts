import { ProposalStatus } from '@consensys/star-fox-sdk';

export const spinnerColor = (status: ProposalStatus): string => {
  switch (status) {
    case ProposalStatus.DEPOSIT_PERIOD:
      return 'blue';
    case ProposalStatus.FAILED:
      return 'red';
    case ProposalStatus.PASSED:
      return 'green';
    case ProposalStatus.REJECTED:
      return 'red';
    case ProposalStatus.VOTING_PERIOD:
      return 'blue';
    default:
      return 'blue';
  }
};

export const formatSpinnerStatus = (proposalStatus: ProposalStatus): string => {
  const strippedText = proposalStatus
    .replace('PROPOSAL_STATUS', '')
    .replace(/_/g, ' ');
  return strippedText.toLowerCase();
};
