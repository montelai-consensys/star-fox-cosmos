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
    useDisclosure,
    Switch
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Logo } from './logo';
import { SidebarRow } from './row';
import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';
import { getNativeTokenImageURI } from '@consensys/star-fox-sdk';
import { GiChaingun } from 'react-icons/gi';
import { AiFillHome } from 'react-icons/ai';
import { BiTransfer } from 'react-icons/bi';
import { SendModal } from '../send/send-modal';
import {CrossChainSendModal} from '../send/cross-chain-send-modal';
import {SidebarChainRow} from './chain-row';
import {useState} from 'react';
import {AccountSidebar} from './account-sidebar';

export const Sidebar = () => {
    const router = useRouter();
    const { isOpen: isOpenSend, onOpen: onOpenSend, onClose: onCloseSend} = useDisclosure();
    const {
        isOpen: isOpenCrossChainSend,
        onOpen: onOpenCrossChainSend,
        onClose: onCloseCrossChainSend
    } = useDisclosure();
    const [isTestnetSwitch, setTestnetSwitch] = useState(false)

    const productionChains = chains.filter(
        chain => chain.network_type === 'mainnet' && getNativeTokenImageURI(chain.chain_id)
    );
    const testnetChains = chains.filter(
        chain => chain.network_type !== 'mainnet' && getNativeTokenImageURI(chain.chain_id)
    );
    const showChains = (chainType: string, chains:Array<Chain>) => {
        return (
            <>
                <Accordion allowToggle >
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                {chainType}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel>
                            {chains.map((chain: Chain) => {
                                return (
                                    <SidebarChainRow
                                        key={chain.chain_id}
                                        isSelected={false}
                                        chain={chain}
                                        imageUrl={getNativeTokenImageURI(chain.chain_id)}
                                        chainName={chain.chain_name}
                                        onClick={() =>
                                            router.push(`/chain/${chain.chain_id}`)
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
            bg="#fefefe"
            width={285}
            height="100%"
            alignItems="flex-start"
            minWidth={285}
            flex={1}
            paddingX={3}
            borderRight="1px solid #dde3f7"
        >
            <Logo />
            <AccountSidebar/>
            <Divider />
            <HStack  textAlign="left" color="#546198" _hover={{color:"#29325d"}} onClick={() => router.push('/')}>
                <Icon as={AiFillHome} />
                <Text>Spaceship Hub</Text>
            </HStack>
            <HStack  textAlign="left" color="#546198" _hover={{color:"#29325d"}} onClick={() => onOpenSend()} >
                <Icon as={BiTransfer} />
                <Text>Send</Text>
                <SendModal onOpen={onOpenSend}  onClose={onCloseSend} isOpen={isOpenSend} />
            </HStack>
            <HStack  textAlign="left" color="#546198" _hover={{color:"#29325d"}} onClick={() => onOpenCrossChainSend()}>
                <Icon as={BiTransfer} />
                <Text>Send Cross Chain</Text>
                <CrossChainSendModal
                    onOpen={onOpenCrossChainSend}
                    onClose={onCloseCrossChainSend}
                    isOpen={isOpenCrossChainSend}
                />
            </HStack>

            {showChains("Networks", productionChains)}

            {isTestnetSwitch && showChains("Testnet", testnetChains)}
            <HStack justifySelf="flex-end"><Text>Show Testnets</Text><Switch isChecked={isTestnetSwitch} onChange={() => setTestnetSwitch(!isTestnetSwitch)}/></HStack>
        </VStack>
    );
};
