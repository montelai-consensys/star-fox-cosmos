import { Text, VStack } from '@chakra-ui/react';
import { VoteType } from '@consensys/star-fox-sdk';

export const Tally = ({
    status,
    count,
    total
}: {
    status: VoteType;
    count: string;
    total: string;
}) => {
    const formatVoteStatus = (status): string => {
        return status.replace('VOTE_OPTION_', '').replace('_', '');
    };

    return (
        <VStack borderRadius={3}>
            <Text>
                {formatVoteStatus(status)} {parseInt(count) / parseInt(total)}%
            </Text>
            <Text>{}</Text>
            <Text>{}</Text>
        </VStack>
    );
};
