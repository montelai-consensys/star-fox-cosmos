import { NextPage } from 'next';
import {  VStack,Text } from '@chakra-ui/react';
import { Debug } from '../components/debug/debug';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

const Home: NextPage = () => {
    const router = useRouter()

    useEffect(()=> {

        //Redirect to osmosis chain because home is not complete
        router.push("/chain/osmo-test-4")

    })
    return (
        <>
            <VStack>
            <Text>Home Page is not complete, redirecting to osmosis testnet</Text>
                <Debug />
            </VStack>
        </>
    );
};

export default Home;
