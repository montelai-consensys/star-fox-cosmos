import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const Logo = () => {
    const router = useRouter();
    return (
        <Flex
            maxH={60}
            paddingTop={'36px'}
            paddingBottom={'20px'}
            direction="row"
            justifyItems="flex-start"
            alignItems="center"
        >
            <Box borderRadius={50} shadow="base">
                <Image
                    width="40px"
                    height="40px"
                    src="/assets/star-fox.png"
                    alt="Star Fox Wallet Logo"
                    onClick={() => router.push('/')}
                />
            </Box>
            <VStack maxH="40px" paddingLeft="10px" alignItems="flex-start">
                <Text fontWeight="extrabold">Star Fox</Text>
                <Text fontWeight="extrabold" marginTop={"-10px"}>
                    Metamask
                </Text>
            </VStack>
        </Flex>
    );
};
