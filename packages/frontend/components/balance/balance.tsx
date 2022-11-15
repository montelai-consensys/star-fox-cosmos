import { Box, Text, Flex } from '@chakra-ui/react';
import { selectBalances } from '../../store/slices/chain.slice';
import { useAppSelector } from '../..//store/store';
import { BalanceComponentType } from '@consensys/star-fox-sdk';

export const Balance = ({ chainId, denom, amount, type }) => {
    const balances = useAppSelector(selectBalances);
    //const chainBalance = balances[chainName];
    const balanceType = (type: BalanceComponentType) => {
        switch (type) {
            case BalanceComponentType.Total:
                return 'Total Balance';
            case BalanceComponentType.Available:
                return 'Available Balance';
            case BalanceComponentType.Staked:
                return 'Total Staked';
            case BalanceComponentType.StakedRewards:
                return 'Available Rewards';
        }
    };

    return (
        <>
            <Box w="200px" minH="130px" maxH="130px" border="1px solid #dde3f7" borderRadius={5} margin={2} paddingY={6} paddingX={5}>
                <Flex direction="column" alignContent="center">
                    <Text color="#7482b6">{balanceType(type)}</Text>
                    <Flex direction="row" alignItems="center" flexWrap="wrap" overflow="clip">
                        <Text fontSize={24} color="#546198v" fontWeight={600} marginRight={2} >{`${amount} `}</Text>
                        <Text color="#546198v">{`${denom.toUpperCase()}`}</Text>
                    </Flex>
                    <Text>${amount * 1.3} USD </Text>
                </Flex>
            </Box>
        </>
    );
};
