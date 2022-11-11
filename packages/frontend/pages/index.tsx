import { NextPage } from 'next';
import {  VStack } from '@chakra-ui/react';
import { Debug } from '../components/debug/debug';

const Home: NextPage = () => {
    return (
        <>
            <VStack>
                <Debug />
            </VStack>
        </>
    );
};

export default Home;
