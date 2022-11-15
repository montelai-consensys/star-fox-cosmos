import { Flex, Spinner } from '@chakra-ui/react';
import { ProposalStatus } from '@consensys/star-fox-sdk';
import { useRouter } from 'next/router';
import { getProposalsAction } from 'packages/frontend/store/actions/chain/getProposals';
import { useAppDispatch } from 'packages/frontend/store/store';
import { useEffect, useState } from 'react';
import { ProposalList } from './proposal-list';

export const GovernancePanel = () => {
    const router = useRouter();
    const { chain_id: chainId} = router.query;
    const dispatch = useAppDispatch();
    const [proposalStatusFilter, setProposalStatusFilter] = useState<ProposalStatus>(
        ProposalStatus.UNSPECIFIC
    );
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (chainId) {
            setLoading(true);
            dispatch(
                getProposalsAction({
                    chainId: chainId as string,
                    proposal_status: ProposalStatus.UNSPECIFIC
                })
            );
            setLoading(false);
        }
    }, [chainId]);

    return (
        <Flex direction="column">
            {isLoading ? <Spinner /> : <ProposalList />}
        </Flex>
    );
};

//<ProposalHeader chainName={chainName}/>
