import {
    HStack,
    VStack,
    Flex,
    Spinner,
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    Text,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { changeNetworkAction } from '../../../store/actions/snap/changeNetwork';
import { useEffect} from 'react';
import { useMetamaskFlask } from '../../../connector/metamask';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { Debug } from '../../../components/debug/debug';
import { ChainDescription } from '../../../components/chain/chainDescription';
import { selectSnapState } from '../../../store/slices/snap.slice';
import { setCurrentNetworkAction } from '../../../store/actions/snap/getNetwork';
import { selectChains } from '../../../store/slices/chain.slice';
import { SnapNetworks } from '@consensys/star-fox-sdk';
import { getChainsAndBalancesAction } from '../../../store/actions/chain/getChainsAndBalances';
import { BalancePanel } from '../../../components/balance-panel/balance-panel';
import { AssetsPanel } from '../../../components/assets/assets';
import { StakePanel } from '../../../components/validators/stake-panel';
import {SendModal} from '../../../components/send/send-modal';
import {GovernancePanel} from '../../../components/proposals/governance-panel';

const Chain = () => {
    const router = useRouter();
    const { chain_id: chainId } = router.query;
    const flask = useMetamaskFlask();
    const dispatch = useAppDispatch();
    const snapState = useAppSelector(selectSnapState);
    const chainState: SnapNetworks = useAppSelector(selectChains);
    const {onOpen, onClose, isOpen} = useDisclosure()

    useEffect(() => {
        if (!chainState || !chainState[chainId as string]) {
            console.debug(`[Chain_Id] Restoring chain reducer`);
            //refresh the chain state lost on rehydrate
            dispatch(getChainsAndBalancesAction());
        }
    }, [chainState, chainId]);

    useEffect(() => {
        if (flask.provider && chainId) {
            console.log(`[chain] ${chainId}`);

            if (!snapState.currentChainId) {
                dispatch(setCurrentNetworkAction());
            } else {
                dispatch(
                    changeNetworkAction({
                        chainId: (chainId as string).toLowerCase()
                    })
                );
            }
        }
        //get account state
    }, [flask, chainId]);

    if (!chainId || !chainState[chainId as string]) {
        return <Spinner />;
    }


    return (
        <Flex display="flex" width="100%">
            <VStack width={'100%'}>
                <ChainDescription chainId={chainId} />
                <BalancePanel chainId={chainId} />
                <HStack>
                    <Button onClick={onOpen} marginRight={5}>
                        Transfer
                    </Button>
                    <SendModal onOpen={onOpen} onClose={onClose} isOpen={isOpen}/>
                    <Button marginRight={5}>IBC Transfer</Button>

                </HStack>
                <Tabs width="100%" isLazy>
                    <TabList>
                        <Tab>Assets</Tab>
                        <Tab>Stakes</Tab>
                        <Tab>Governance Proposals</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <AssetsPanel chainId={chainId} />
                        </TabPanel>
                        <TabPanel>
                            <StakePanel chainId={chainId} />
                        </TabPanel>

                        <TabPanel><GovernancePanel/></TabPanel>
                    </TabPanels>
                </Tabs>
                <HStack>
                    <Text>{chainId}</Text>
                    <Debug />
                </HStack>
            </VStack>
        </Flex>
    );
};

export default Chain;

