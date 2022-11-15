import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { selectProposalsByChainId } from 'packages/frontend/store/slices/chain.slice';
import { useAppSelector } from 'packages/frontend/store/store';
import { ProposalItem } from './proposal';

export const ProposalList = () => {
    const router = useRouter();
    const { chain_id: chainId } = router.query;
    const proposals = useAppSelector(selectProposalsByChainId(chainId as string));
    console.log(proposals)

    return (
        <Flex flexFlow="row wrap" justifyContent="space-around" maxHeight="50vh" overflowY="auto">
            {proposals.map(proposal => {

                return (
                    <ProposalItem
                        key={`${chainId}/proposal/${proposal.proposal_id}`}
                        proposal={proposal}
                    />
                );
            })}
        </Flex>
    );
};
