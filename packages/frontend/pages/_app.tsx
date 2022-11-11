import { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { MetamaskProvider } from '../connector/metamask';
import { persistor, store } from '../store/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {

    return (
        <Box>
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
        </Box>
    );
}

export default MyApp;
