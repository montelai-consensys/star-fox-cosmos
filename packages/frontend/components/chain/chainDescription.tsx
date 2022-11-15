import { Flex, Heading, HStack, Spinner, VStack } from '@chakra-ui/react';
import { selectChains } from '../../store/slices/chain.slice';
import { useAppSelector } from '../../store/store';
import { Text, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineGlobal } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { selectSnapCurrentAddress } from '../../store/slices/snap.slice';
import { getChain, getNativeTokenImageURI } from '@consensys/star-fox-sdk';
import { Chain } from '@chain-registry/types';

export const ChainDescription = ({ chainId }) => {
    const chains = useAppSelector(selectChains);
    const [chain, setChain] = useState<Chain | null>(getChain(chainId));

    useEffect(() => {
        setChain(getChain(chainId));
    }, [chainId]);

    return (
        <Flex
            flex={1}
            width={'100%'}
            minHeight={'93px'}
            maxHeight={"120px"}
            paddingX={'16px'}
            paddingY={'20px'}
            marginBottom={15}
            bg={'#f4f7fd'}
            borderRadius={10}
        >
            <Flex direction="row" flex={1}>
                <Image
                    src={getNativeTokenImageURI(chainId)}
                    alt={`${chain.chain_name} logo`}
                    width={56}
                    height={56}
                />
                <Flex direction="column" marginLeft={'10px'} marginRight="auto">
                    <Heading>{chain.chain_name}</Heading>
                    <Text justifySelf={'flex-end'}>{chainId} Address: {chains[chainId].address}</Text>
                </Flex>
                <VStack display="flex" justify="flex-end" align="flex-end">
                    <HStack>
                        <Link
                            href={`https://www.mintscan.io/${chain.chain_name}/account/${chains[chainId].address}`}
                        >
                            <Text>Block Explorer</Text>
                        </Link>
                        <Icon as={AiOutlineGlobal} />
                    </HStack>

                    {chain.website && (
                        <HStack>
                            <Link href={chain.website}>
                                <Text>Website</Text>
                            </Link>
                            <Icon as={AiOutlineGlobal} />
                        </HStack>
                    )}
                    {chain?.codebase.git_repo && (
                        <HStack>
                            <Link href={chain.codebase.git_repo}>
                                <Text>Github</Text>
                            </Link>
                            <Icon as={AiOutlineGlobal} />
                        </HStack>
                    )}
                </VStack>
            </Flex>
        </Flex>
    );
};
