import { VStack, Text, HStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';

export const VoteTotal = ({
    amount,
    total,
    decimals,
    symbol,
    voteType
}: {
    amount: string;
    total: string;
    decimals: number;
    symbol: string;
    voteType: string;
}) => {
    const getVoteTextColor = (): string => {
        switch (voteType) {
            case 'Yes':
                return '#60d6a7';
            case 'No':
                return '#f9a1a4';
            case 'Abstain':
                return '#747eab';
            case 'No with veto':
                return '#ff8291';
            default:
                return 'black';
        }
    };

    return (
        <VStack alignItems="flex-start" bg="#FEFEFE" borderRadius={10} padding="20px">
            <HStack color={getVoteTextColor()}>
                <Text>{voteType}</Text>
                <Text>
                    {new BigNumber(amount)
                        .dividedBy(total)
                        .multipliedBy(100)
                        .toPrecision(4)}
                    %
                </Text>
            </HStack>
            <HStack>
                <Text fontSize="12px" color="#7482b6">
                    {new BigNumber(amount).shiftedBy(-decimals).toString()} {symbol}
                </Text>
            </HStack>
        </VStack>
    );
};
