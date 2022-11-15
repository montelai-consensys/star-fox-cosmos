import { Flex, Icon } from '@chakra-ui/react';
import {useRouter} from 'next/router';
import {selectProposalsByChainId} from 'packages/frontend/store/slices/chain.slice';
import {useAppSelector} from 'packages/frontend/store/store';

export const ProposalHeader = () => {
    const router = useRouter()
    const { chain_id: chainId} = router.query;
    const proposals = useAppSelector(selectProposalsByChainId(chainId as string))
    return (
        <Flex justifyContent="space-between">
            <Icon />
        </Flex>
    );
};
