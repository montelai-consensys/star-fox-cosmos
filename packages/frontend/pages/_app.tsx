import { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { Flex, ChakraProvider} from '@chakra-ui/react';
import { MetamaskProvider } from '../connector/metamask';
import { persistor, store } from '../store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {

    return (
        <Flex flex="1" justifyContent='center' bg="#fcfcfc">
            <ChakraProvider>
                <MetamaskProvider>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </PersistGate>
                    </Provider>
                </MetamaskProvider>
            </ChakraProvider>
        </Flex>
    );
}

export default MyApp;
