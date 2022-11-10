import { MetamaskTendermintOfflineSigner } from '@consensys/star-fox-sdk';
import { OfflineAminoSigner } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { AnyAction } from '@reduxjs/toolkit';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { siteConfig } from '../config/siteConfig';
import {installSnap} from '../utils/installSnap';

const initialMetamaskState: MetamaskProviderState = {
    provider: null,
    signer: null,
    ready: false,
    error: null
};

const MetamaskContext = createContext(initialMetamaskState);

export interface MetamaskProviderState {
    provider: typeof Proxy<MetaMaskInpageProvider> | null;
    signer: OfflineAminoSigner | OfflineDirectSigner;
    error: string;
    ready: boolean;
}

let cachedProvider: MetaMaskInpageProvider = null;
export const getWalletProvider = async (): Promise<MetaMaskInpageProvider> => {
    if (cachedProvider) {
        return cachedProvider;
    }

    console.info(`[getWalletProvider] intializing metamask inpage provider`);
    cachedProvider = (await detectEthereumProvider()) as MetaMaskInpageProvider;
    return cachedProvider;
};

function metamaskReducer(state: MetamaskProviderState, action: AnyAction) {
    console.debug(`metamaskReducer action.type=${action.type}`, action.payload);
    switch (action.type) {
        case 'setProvider': {
            const { provider } = action.payload;
            return {
                ...state,
                provider: provider,
                ready: true
            };
        }
        case 'setSigner': {
            const { provider } = action.payload;

            const signer = new MetamaskTendermintOfflineSigner(
                provider,
                siteConfig.snapId
            );
            return {
                ...state,
                signer
            };
        }
        case 'error': {
            const { error } = action.payload;
            return {
                ...state,
                error: error
            };
        }
        case 'setReady': {
            const { ready } = action.payload;
            return {
                ...state,
                ready
            };
        }
        default: {
            throw new Error(`Unknown action type ${action.type}`);
        }
    }
}

const MetamaskProvider = ({ children }) => {
    const [state, reactDispatch] = useReducer(metamaskReducer, initialMetamaskState);
    const { snapId, snapVersion } = siteConfig;

    useEffect(() => {
        console.debug(
            ` useEffect in MetamaskProvider snapId=${snapId} snapVersion=${snapVersion}`,
            state
        );
        const doAsync = async () => {

            if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
                console.error(`no web3 detected - cannot intialize wallet`);
                reactDispatch({ type: 'error', payload: { error: 'No web3 detected' } });
                return;
            }

            const provider = await getWalletProvider();
            console.debug(`[doAsync] provider is `, provider);
            reactDispatch({ type: 'setProvider', payload: { provider } });

            const isFlask = (
                (await provider?.request({ method: 'web3_clientVersion' })) as string
            )?.includes('flask');
            if (!isFlask) {
                reactDispatch({
                    type: 'error',
                    payload: { error: 'Please install metamask flask' }
                });
                console.error(`Metamask Flask is not installed`);
                return;
            }
            reactDispatch({ type: 'setSigner', payload: { provider } });
            const snapState = JSON.parse(localStorage.getItem('snapInstalled'));
            if (!snapState?.installed) {
                let walletEnableResult;
                try {
                    walletEnableResult = await installSnap(provider)
                    console.debug(
                        `[snapSetupAction] snap is enabled`,
                        walletEnableResult
                    );
                    const accounts = walletEnableResult.accounts;
                    console.log(`Accounts enabled: ${accounts}`);
                } catch (error) {
                    console.log(error);
                    // The `wallet_enable` call will throw if the requested permissions are
                    // rejected.
                    if (error.code === 4001) {
                        console.log('The user rejected the request.');
                    } else {
                        console.log('Unexpected error:', error);
                    }
                }
            }
        };
        doAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getWalletProvider()
            .then(async provider => {
                await eventHandler(provider as MetaMaskInpageProvider);
            })
            .catch(err => {
                console.error(`An error occured when starting eventHandler`, err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reconnect = async ({ provider, address }) => {
        const network = parseInt(
            (await provider.request({ method: 'eth_chainId' })) as string
        );
        console.debug(`[reconnect] Current network chainId=${network}`);

        const payload = {
            network,
            address: address
        };
        console.log(`[reconnect] dispatch 'connectwallet'`, payload);
        //reduxDispatch(connectWallet(payload))
    };

    const eventHandler = async (provider: MetaMaskInpageProvider) => {
        console.info(`[eventHandler] starting event handler for provider`, provider);
        provider.on('connect', connectInfo => {
            console.info(`[eventHandler][connect] metamask connected.`, connectInfo);
            //reduxDispatch(triggerUpdate({}))
        });

        provider.on('accountsChanged', async (accounts: Array<string>) => {
            console.debug(
                `[eventHandler][accountsChanged] accounts have changed`,
                accounts
            );

            if (accounts.length === 0) {
                const errorMsg = 'no account connected';
                //reduxDispatch(disconnect({ error: errorMsg }))
                return;
            }

            // must use force to prevent silent error in metamask install
            //reduxDispatch(snapSetupAction({ force: true }))
        });

        provider.on('disconnect', (error: Error) => {
            console.error(`[eventHandler][disconnect] metamask disconnected`, error);
            //reduxDispatch(disconnect({ error }))
            reactDispatch({ type: 'error', payload: { error } });
        });

        provider.on('chainChanged', async (chainId: string) => {
            console.debug(`[eventHandler][chainChanged]  chainId has changed`, chainId);
            //reduxDispatch(updateNetworkAction({ network: parseInt(chainId) }))
            //console.debug(`[eventHandler][chainChanged]  new state`, snapState)
        });

        provider.on('message', message => {
            console.debug(
                `[eventHandler][message] message received from provider`,
                message
            );
        });
    };

    return <MetamaskContext.Provider value={state}>{children}</MetamaskContext.Provider>;
};

export const useMetamaskFlask = () => {
    const context = useContext(MetamaskContext);
    // console.log(context)

    if (context === undefined) {
        throw new Error('Snap context is missing, must be within provide');
    }
    return context;
};

export { MetamaskProvider };
