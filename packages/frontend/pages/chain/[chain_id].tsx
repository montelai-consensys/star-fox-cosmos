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
    Button,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { changeNetworkAction } from '../../store/actions/snap/changeNetwork';
import { useEffect,  useState } from 'react';
import { useMetamaskFlask } from '../../connector/metamask';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Debug } from '../../components/debug/debug';
import { ChainDescription } from '../../components/chain/chainDescription';
import { selectSnapState } from '../../store/slices/snap.slice';
import { setCurrentNetworkAction } from '../../store/actions/snap/getNetwork';
import { selectChains } from '../../store/slices/chain.slice';
import { SnapNetworks } from '@consensys/star-fox-sdk';
import { getChainsAndBalancesAction } from '../../store/actions/chain/getChainsAndBalances';
import { BalancePanel } from '../../components/balance-panel/balance-panel';
import { AssetsPanel } from '../../components/assets/assets';
import { StakePanel } from '../../components/validators/stake-panel';
import {SendModal} from '../../components/send/send-modal';

const Chain = () => {
    const router = useRouter();
    const { chain_id: chainName } = router.query;
    const [error, setError] = useState<string>('');
    const flask = useMetamaskFlask();
    const dispatch = useAppDispatch();
    const snapState = useAppSelector(selectSnapState);
    const chainState: SnapNetworks = useAppSelector(selectChains);
    const {onOpen, onClose, isOpen} = useDisclosure()

    useEffect(() => {
        if (!chainState || !chainState[chainName as string]) {
            console.debug(`[Chain_Id] Restoring chain reducer`);
            //refresh the chain state lost on rehydrate
            dispatch(getChainsAndBalancesAction());
        }
    }, []);

    useEffect(() => {
        if (flask.provider && chainName) {
            console.log(`[chain] ${chainName}`);
            if (!flask.provider) setError('[Flask Eror] Unable to get provider to flask');

            if (!snapState.currentChain) {
                dispatch(setCurrentNetworkAction());
            } else {
                dispatch(
                    changeNetworkAction({
                        chainName: (chainName as string).toLowerCase()
                    })
                );
            }
        }
        //get account state
    }, [flask, chainName]);

    if (!chainName || !chainState[chainName as string]) {
        return <Spinner />;
    }


    return (
        <Flex display="flex" width="100%">
            <VStack width={'100%'}>
                <ChainDescription chainName={chainName} />
                <BalancePanel chainName={chainName} />
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
                            <AssetsPanel chainName={chainName} />
                        </TabPanel>
                        <TabPanel>
                            <StakePanel chainName={chainName} />
                        </TabPanel>

                        <TabPanel>Todo</TabPanel>
                    </TabPanels>
                </Tabs>
                <HStack>
                    <Text>{chainName}</Text>
                    <Debug />
                </HStack>
            </VStack>
        </Flex>
    );
};

export default Chain;
