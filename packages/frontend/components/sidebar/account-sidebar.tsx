import { Flex, Skeleton, VStack, HStack, Text, Spinner, Tooltip } from '@chakra-ui/react';
import { selectChainByChainId } from 'packages/frontend/store/slices/chain.slice';
import { selectSnapState } from 'packages/frontend/store/slices/snap.slice';
import { useAppSelector } from 'packages/frontend/store/store';

export const AccountSidebar = () => {
    const snapState = useAppSelector(selectSnapState);
    const chain = useAppSelector(selectChainByChainId(snapState.currentChainId));

    const mininmizeText = (text: string): string => {
        if (text.length > 15) {
            const newText = `${text.slice(0, 9)}...${text.slice(-5)}`;
            return newText;
        }
        return text;
    };

    return (
        <VStack width="100%" alignItems="flex-start" color="#29325d" fontSize={"14px"} lineHeight="3">
            {process.env.NODE_ENV !== 'production' && (
                <HStack>
                    <Text fontWeight="semibold">Snap Id: </Text>
                    {chain ? <Text>{snapState.snapId}</Text> : <Spinner />}
                </HStack>
            )}
            <HStack>
                <Text fontWeight="semibold">Current Chain: </Text>
                {chain ? <Text>{snapState.currentChainId}</Text> : <Spinner />}
            </HStack>
            <HStack>
                <Text fontWeight="semibold">Current Address: </Text>
                {chain ? (
                    <Tooltip label={snapState.currentAddress}>
                        <Text>{mininmizeText(snapState.currentAddress)}</Text>
                    </Tooltip>
                ) : (
                    <Spinner />
                )}
            </HStack>
        </VStack>
    );
};
