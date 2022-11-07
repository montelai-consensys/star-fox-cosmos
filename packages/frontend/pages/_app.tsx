import { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { ChakraProvider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MetamaskProvider } from '../connector/metamask';
import { persistor, store, wrapper } from '../store/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

function MyApp({ Component, pageProps }: AppProps) {
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    return (
        <div>
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
        </div>
    );
}

export default MyApp;
