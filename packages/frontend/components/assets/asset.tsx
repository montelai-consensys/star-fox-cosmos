import { Box, Flex, Text, VStack, Image } from '@chakra-ui/react';
import { getNativeTokenImageURI } from '@consensys/star-fox-sdk';

export const Asset = ({ chainId, imageURI, symbol, amount, decimal }) => {
    return (
        <Flex
            width="100%"
            flex={1}
            marginBottom={3}
            paddingX={5}
            paddingY={5}
            border="1px solid #dde3f7"
            borderRadius={5}
            justifyContent="space-between"
        >
            <VStack>
                <Box borderRadius={50} position="relative">
                    <Image
                        src={imageURI}
                        alt={`${chainId}-${symbol}`}
                        width="32px"
                        height="32px"
                    />
                    <Image
                        src={getNativeTokenImageURI(chainId)}
                        alt="osmosis-native-token"
                        width="20px"
                        height="20px"
                        style={{position: "absolute", top: "16px", left: "16px"}}
                    />
                </Box>
                <Text>{symbol}</Text>
            </VStack>
            <VStack>
                <Text>${amount * 1.3} USD</Text>
                <Text>
                    {amount} {symbol}
                </Text>
            </VStack>
        </Flex>
    );
};
