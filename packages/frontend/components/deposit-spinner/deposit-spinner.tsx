import { HStack, Spinner, Text } from '@chakra-ui/react';
import { GovernanceProposal } from '@consensys/star-fox-sdk';
import { isBefore, isDate } from 'date-fns';
import { spinnerColor, formatSpinnerStatus } from 'packages/frontend/utils/spinner';

export const DepositSpinner = ({ proposal }: { proposal: GovernanceProposal }) => {
    const showSpinner = (proposal: GovernanceProposal): boolean => {
        return (
            !isDate(new Date(Date.parse(proposal.voting_end_time))) ||
            isBefore(new Date(), Date.parse(proposal.voting_end_time))
        );
    };

    return (
        <HStack
            bg={`${spinnerColor(proposal.status)}.300`}
            height="40px"
            minWidth="90px"
            maxWidth="90px"
            borderRadius={3}
            paddingX={'5px'}
            paddingY={'5px'}
            justifyContent="center"
        >
            {showSpinner(proposal) && (
                <Spinner
                    color={`${spinnerColor(proposal.status)}.600`}
                    size="sm"
                    thickness="1px"
                />
            )}
            <Text
                fontSize={'10px'}
                color={`${spinnerColor(proposal.status)}.800`}
                casing={'capitalize'}
            >
                {formatSpinnerStatus(proposal.status)}
            </Text>
        </HStack>
    );
};
