import { Divider, Flex, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ProposalSummary } from 'packages/frontend/components/proposals/proposal-summary';
import { VoteDetail } from 'packages/frontend/components/vote-detail/vote-detail';
import { ProposalDescription } from 'packages/frontend/components/proposals/proposal-description';
import { selectChainByChainId, selectProposalsByChainId } from 'packages/frontend/store/slices/chain.slice';
import { useAppSelector } from 'packages/frontend/store/store';
import { GovernanceProposal } from '@consensys/star-fox-sdk';
import { useEffect, useState } from 'react';

const ProposalContent = () => {
    const router = useRouter();
    const { chain_id: chainId, proposal_id } = router.query;
    const chains = useAppSelector(selectChainByChainId(chainId as string))
    const proposals = useAppSelector(selectProposalsByChainId(chainId as string));
    const [proposal, setProposal] = useState(null);

    useEffect(() => {
        if (proposals) {
            const proposal: GovernanceProposal = proposals.find(
                proposal => proposal.proposal_id === (proposal_id as string)
            );
            setProposal(proposal);
        }
    }, [proposals, proposal_id]);

    if (!proposal) {
        return (
            <Flex alignItems="center">
                <Heading>Proposal #{proposal_id} was not found.</Heading>
            </Flex>
        );
    }

    return (
        <Flex
            bg="#f8fafd"
            direction="column"
            flexGrow={1}
            borderRadius={3}
            width="100%"
            padding="32px"
            alignItems="flex-start"
            overflowY="hidden"
        >
            <ProposalSummary proposal={proposal} />
            <VoteDetail proposal={proposal} />
            <Divider />
            <ProposalDescription chainName={chains[chainId as string].name} description={proposal.content.description} />
        </Flex>
    );
};

export default ProposalContent;
