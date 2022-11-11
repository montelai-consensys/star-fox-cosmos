import {
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    Box,
    AccordionIcon,
    AccordionPanel,
    Divider,
    Icon,
    Text,
    HStack,
    useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Logo } from './logo';
import { SidebarRow } from './row';
import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';
import { getTokenImageURI } from '@consensys/star-fox-sdk';
import { GiChaingun } from 'react-icons/gi';
import { AiFillHome } from 'react-icons/ai';
import { BiTransfer } from 'react-icons/bi';
import {SendModal} from '../send/send-modal';

export const Sidebar = () => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const productionChains = chains.filter(
        chain => chain.network_type === 'mainnet' && getTokenImageURI(chain.chain_name)
    );
    const testnetChains = chains.filter(
        chain => chain.network_type !== 'mainnet' && getTokenImageURI(chain.chain_name)
    );
    const showTestnets = () => {
        return (
            <>
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    Testnets
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel>
                            {testnetChains.map((chain: Chain) => {
                                return (
                                    <SidebarRow
                                        key={chain.chain_id}
                                        isSelected={false}
                                        chain={chain}
                                        imageUrl={getTokenImageURI(chain.chain_name)}
                                        chainName={chain.chain_name}
                                        onClick={() =>
                                            router.push(`/chain/${chain.chain_name}`)
                                        }
                                    />
                                );
                            })}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </>
        );
    };

    const showMainnets = () => {
        return (
            <>
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <HStack flex="1" textAlign="left">
                                    <Icon as={GiChaingun} />
                                    <Text>Chains</Text>
                                </HStack>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <SidebarRow
                            chain={productionChains.find(
                                chain => chain.chain_name === 'cosmoshub'
                            )}
                            isSelected={true}
                            imageUrl={getTokenImageURI('cosmoshub')}
                            chainName="cosmoshub"
                            onClick={chainId => {
                                router.push(`/chain/${chainId}`);
                            }}
                        />
                        <SidebarRow
                            chain={productionChains.find(
                                chain => chain.chain_name === 'osmosis'
                            )}
                            isSelected={false}
                            imageUrl={getTokenImageURI('osmosis')}
                            chainName="osmosis"
                            onClick={chainId => {
                                router.push(`/chain/${chainId}`);
                            }}
                        />

                        <AccordionPanel>
                            {productionChains.map((chain: Chain) => {
                                return (
                                    <SidebarRow
                                        key={chain.chain_id}
                                        isSelected={false}
                                        chain={chain}
                                        imageUrl={getTokenImageURI(chain.chain_name)}
                                        chainName={chain.chain_name}
                                        onClick={() =>
                                            router.push(`/chain/${chain.chain_name}`)
                                        }
                                    />
                                );
                            })}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </>
        );
    };

    return (
        <VStack
            bg="#e5e7eb"
            width={285}
            height="100%"
            alignItems="flex-start"
            minWidth={285}
            flex={1}
            overflowY="scroll"
        >
            <Logo />
            <Divider />
            <HStack flex="1" textAlign="left" onClick={() => router.push('/')}>
                <Icon as={AiFillHome} />
                <Text>Home</Text>
            </HStack>
            <HStack flex="1" textAlign="left" onClick={()=>onOpen()}>
                <Icon as={BiTransfer} />
                <Text>Send</Text>
                <SendModal onOpen={onOpen} onClose={onClose} isOpen={isOpen}/>
            </HStack>

            <Divider />
            {showMainnets()}

            {process.env.NODE_ENV === 'development' && showTestnets()}
        </VStack>
    );
};
