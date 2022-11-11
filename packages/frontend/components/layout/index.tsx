import { Flex, useDisclosure } from '@chakra-ui/react';
import { Sidebar } from '../sidebar/sidebar';
import { ReactNode, useEffect } from 'react';
import { useMetamaskFlask } from '../../connector/metamask';
import { SnapInstallAlert } from '../snap-install-modal/snap-install-modal';

export const Layout = ({ children }: { children: ReactNode }) => {
    const flask = useMetamaskFlask();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (
            flask.error === 'no web3 detected - cannot intialize wallet' ||
            flask.error === 'Please install metamask flask'
        ) {
            onOpen();
        }
    }, [flask]);

    return (
        <Flex
            direction="row"
            justifyContent={'center'}
            alignItems="flex-start"
            maxW={1200}
            height={'100%'}
            minHeight={'100%'}
            display="flex"
        >
            <Sidebar />
            <Flex display="flex" width="100%" padding={2.5}>
                {children}
            </Flex>
            <SnapInstallAlert isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </Flex>
    );
};
