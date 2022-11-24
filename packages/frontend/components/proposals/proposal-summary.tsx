import {
    HStack,
    VStack,
    Text,
    Button,
    Image,
    Heading,
    Icon
} from '@chakra-ui/react';
import { AiFillStepBackward } from 'react-icons/ai'
import { getNativeTokenImageURI, getTokenImageURI, GovernanceProposal } from '@consensys/star-fox-sdk';
import { formatISO9075, isAfter, isBefore, isDate } from 'date-fns';
import { useRouter } from 'next/router';
import { DepositSpinner } from '../deposit-spinner/deposit-spinner';

export const ProposalSummary = ({ proposal }: { proposal: GovernanceProposal }) => {
    const router = useRouter();
    const { chain_id: chainId } = router.query;

    const fontFamily = 'verdana';

    return (
        <VStack alignItems="flex-start" width="100%" marginBottom="32px">
            <HStack><Icon as={AiFillStepBackward} onClick={()=> router.back()}/><DepositSpinner proposal={proposal} /></HStack>
            
            <HStack marginTop="20px" marginBottom="32px">
                <Image
                    src={getNativeTokenImageURI(chainId as string)}
                    alt={`${chainId} logo`}
                    width="56px"
                    height="56px"
                    marginRight="32px"
                />
                <Heading
                    as="h3"
                    size="lg"
                >{`#${proposal.proposal_id} ${proposal.content.title}`}</Heading>
            </HStack>

            <HStack justifyContent="space-between">
                <VStack alignItems="flex-start">
                    <Text fontFamily={fontFamily}>Submit Time</Text>
                    <Text fontFamily={fontFamily}>
                        {formatISO9075(new Date(Date.parse(proposal.submit_time)))}
                    </Text>
                </VStack>
                <VStack alignItems="flex-start">
                    <Text fontFamily={fontFamily}>Voting Start Time</Text>
                    <Text fontFamily={fontFamily}>
                        {isDate(new Date(Date.parse(proposal.voting_start_time)))
                            ? formatISO9075(
                                  new Date(Date.parse(proposal.voting_start_time))
                              )
                            : 'Unknown'}
                    </Text>
                </VStack>
                <VStack alignItems="flex-start" marginRight="auto">
                    <Text fontFamily={fontFamily}>Voting End Time</Text>
                    <Text fontFamily={fontFamily}>
                        {isDate(new Date(Date.parse(proposal.voting_start_time)))
                            ? formatISO9075(
                                  new Date(Date.parse(proposal.voting_end_time))
                              )
                            : 'Unknown'}
                    </Text>
                </VStack>
                <Button
                    colorScheme="blue"
                    disabled={
                        !isDate(new Date(Date.parse(proposal.voting_start_time))) &&
                        (isBefore(
                            new Date(Date.parse(proposal.voting_start_time)),
                            new Date()
                        ) ||
                            isAfter(
                                new Date(),
                                new Date(Date.parse(proposal.voting_end_time))
                            ))
                    }
                    onClick={() => alert('vote clicked')}
                >
                    Vote
                </Button>
            </HStack>
        </VStack>
    );
};
