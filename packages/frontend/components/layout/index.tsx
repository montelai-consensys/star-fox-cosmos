import { Container, Flex } from '@chakra-ui/react';
import { Sidebar } from '../sidebar/sidebar';
import { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <Flex
            direction="row"
            justifyContent={'center'}
            alignItems="flex-start"
            maxW={1200}
            height={"100%"}
            minHeight={"100%"}
            display="flex"
        >
            <Sidebar />
            <Flex display="flex"  width="100%" padding={2.5}>
                {children}
            </Flex>
        </Flex>
    );
};
