import { createAsyncThunk } from '@reduxjs/toolkit';
import { getGovernanceProposals } from 'packages/frontend/api/cosmos';
import { updateGovernanceProposalByChain } from '../../slices/chain.slice';
import {
  GovernanceProposal,
  GovernanceProposalQuery,
  GovernanceProposalsResponse,
} from '@consensys/star-fox-sdk';

export const getProposalsAction = createAsyncThunk(
  'actions/chains/getProposals',
  async (governanceProposalQuery: GovernanceProposalQuery, thunkAPI) => {
    const { chainName } = governanceProposalQuery;
    console.debug(
      `[getProposalsAction] Getting proposals for chain: ${chainName}`
    );

    const governanceProposalsResponse: GovernanceProposalsResponse =
      await getGovernanceProposals(governanceProposalQuery);

    let nextKey = governanceProposalsResponse.pagination.next_key;
    let proposals: Array<GovernanceProposal> =
      governanceProposalsResponse.proposals;

    while (governanceProposalsResponse.pagination.next_key) {
      console.log(nextKey);
      const additionalProposalsResponse: GovernanceProposalsResponse =
        await getGovernanceProposals({
          ...governanceProposalQuery,
          paginationParams: { 'pagination.key': nextKey },
        });

      proposals = [...proposals, ...additionalProposalsResponse.proposals];

      if (additionalProposalsResponse.pagination.next_key === null) break;

      nextKey = additionalProposalsResponse.pagination.next_key;
    }

    thunkAPI.dispatch(
      updateGovernanceProposalByChain({
        chainName,
        proposals: proposals.reverse(),
      })
    );

    console.debug(`[getProposalActions] Completed`, proposals.reverse());

    return proposals;
  }
);
