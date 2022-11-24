import { Flex, Spinner, useDisclosure } from '@chakra-ui/react';
import { Sidebar } from '../sidebar/sidebar';
import { ReactNode, useEffect } from 'react';
import { useMetamaskFlask } from '../../connector/metamask';
import { SnapInstallAlert } from '../snap-install-modal/snap-install-modal';
import { selectAppState, useAppDispatch, useAppSelector } from 'packages/frontend/store/store';
import {  selectChains } from 'packages/frontend/store/slices/chain.slice';
import { getChainsAndBalancesAction } from 'packages/frontend/store/actions/chain/getChainsAndBalances';

export const Layout = ({ children }: { children: ReactNode }) => {
    const flask = useMetamaskFlask();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const state = useAppSelector(selectAppState);
    const chainState = useAppSelector(selectChains)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (
            flask.error === 'no web3 detected - cannot intialize wallet' ||
            flask.error === 'Please install metamask flask'
        ) {
            onOpen();
        }
    }, [flask]);

    useEffect(()=>{
if (state._persist.rehydrated && !chainState){
    console.debug(`[Chain_Id] Restoring chain reducer`);
    dispatch(getChainsAndBalancesAction());
}

    }, [state._persist.rehydrated, chainState])

    return (
        <Flex
            direction="row"
            justifyItems={'center'}
            alignItems="flex-start"
            w="1200px"
            maxW="1200px"
            height={'100%'}
            minHeight={'100%'}
            borderRadius={5}
            display="flex"
        >
            {state._persist.rehydrated ? (
                <>
                    <Sidebar />
                    <Flex display="flex" width="100%" height="100%" padding={2.5} bg="#fefefe">
                        {children}
                    </Flex>
                    <SnapInstallAlert isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
                </>
            ) : (
                <Spinner />
            )}
        </Flex>
    );
};
