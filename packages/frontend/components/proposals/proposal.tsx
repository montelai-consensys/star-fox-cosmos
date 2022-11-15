import { Box, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { GovernanceProposal} from '@consensys/star-fox-sdk';
import { formatRFC7231, isAfter } from 'date-fns';
import { useRouter } from 'next/router';
import { BiRightArrowAlt } from 'react-icons/bi';
import { DepositSpinner } from '../deposit-spinner/deposit-spinner';

export const ProposalItem = ({ proposal }: { proposal: GovernanceProposal }) => {
    const router = useRouter();
    const { chain_id: chainName } = router.query;
    const isDepositPeriod = (dateString: string): boolean => {
        return isAfter(new Date(Date.parse(dateString)), new Date());
    };

    return (
        <Flex
            width="400px"
            maxWidth="400px"
            padding="10px"
            marginBottom="10px"
            borderRadius={5}
            bg="#fbfcfe"
            flexFlow="column"
            _hover={{
                bg: '#f4f7fd'
            }}
        >
            <VStack width={'95%'} alignItems="flex-start" justifyContent="space-between">
                <HStack alignItems="flex-start">
                    <DepositSpinner proposal={proposal} />
                    <Text>
                        #{proposal.proposal_id} {proposal.content.title}
                    </Text>
                </HStack>
                <VStack alignItems="flex-start">
                    <Text>
                        {isDepositPeriod(proposal.deposit_end_time)
                            ? 'Deposit end time'
                            : 'Voting end time'}
                    </Text>
                    <Text>
                        {formatRFC7231(
                            Date.parse(
                                isDepositPeriod(proposal.deposit_end_time)
                                    ? proposal.deposit_end_time
                                    : proposal.voting_end_time
                            )
                        )}
                    </Text>
                </VStack>
            </VStack>
            <VStack
                alignItems="center"
                justifyContent="center"
                onClick={() =>
                    router.push(`/chain/${chainName}/proposal/${proposal.proposal_id}`)
                }
            >
                <Icon as={BiRightArrowAlt} />
            </VStack>
        </Flex>
    );
};
