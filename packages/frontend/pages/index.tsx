import { NextPage } from 'next';
import { useConnect, useSigner, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { Button, VStack } from '@chakra-ui/react'
import { useMetamaskFlask } from '../connector/metamask';
import {Debug} from '../components/debug/debug';

const Home: NextPage = () => {

    const [flaskError, setFlaskError] = useState('');
    const [balance, setBalance] = useState(0);
    const flask = useMetamaskFlask();

    return (
        <>
            <VStack>
                {flaskError && <div>{flaskError}</div>}
                <Debug/>
            </VStack>
        </>
    );
};

export default Home;
