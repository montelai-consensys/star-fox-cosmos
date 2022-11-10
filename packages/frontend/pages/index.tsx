import { NextPage } from 'next';
import { useConnect, useSigner, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { Button, VStack } from '@chakra-ui/react';
import {
    changeNetwork,
    getBalance,
    invokeHello,
    invokeSendToken,
    resetAccount
} from '../api';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { useMetamaskFlask } from '../connector/metamask';
import { siteConfig } from '../config/siteConfig';
import { coins, SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { useAppDispatch } from '../store/store';
import { changeNetworkAction } from '../store/actions/snap/changeNetwork';
import {Debug} from '../components/debug/debug';

const Home: NextPage = () => {
    //const provider = useSigner();
    const [flaskError, setFlaskError] = useState('');
    const [balance, setBalance] = useState(0);
    const flask = useMetamaskFlask();
    const dispatch = useAppDispatch();

    console.log('flask', flask);

    //useEffect(() => {}, []);

    const installSnap = async () => {
        //@ts-ignore
        const isFlask = (
            (await flask.provider.request({
                method: 'web3_clientVersion'
            })) as string
        )?.includes('flask');
        if (!isFlask) {
            setFlaskError('Flask is not installed');
        }

        let walletEnableResult;
        try {
            walletEnableResult = await flask.provider.request({
                method: 'wallet_enable',
                // This entire object is ultimately just a list of requested permissions.
                // Every snap has an associated permission or permissions, given the prefix `wallet_snap_`
                // and its ID. Here, the `wallet_snap` property exists so that callers don't
                // have to specify the full permission permission name for each snap.
                params: [
                    {
                        wallet_snap: { 'local:http://localhost:8080/': { version: '*' } },
                        eth_accounts: {}
                    }
                ]
            });
            console.debug(`[snapSetupAction] snap is installed`, walletEnableResult);
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
    };

    const sendPing = async () => {
        //@ts-ignore
        const result = await invokeHello(flask.provider);
    };

    const sendToken = async () => {
        //@ts-ignore
        const result = await invokeSendToken(flask.provider);
    };

    const retrieveBalance = async () => {
        console.log('getting balance');
        //@ts-ignore
        const result = await getBalance(
            flask.provider,
            'osmosis',
            'osmo1a9m4a3g7j6mcrahk4pm4rpe4dez3hx26j0f2aj',
            'uosmo'
        );
        console.log('Result', result);
        setBalance(result);
    };

    const testBlockHeight = async () => {
        console.log('testBlockHeight');
        const offlineSigner = flask.signer;

        const signingStargateClient = await SigningStargateClient.connectWithSigner(
            'https://rpc-test.osmosis.zone',
            offlineSigner
        );

        console.log(
            await signingStargateClient.getAccount(
                'osmo1a9m4a3g7j6mcrahk4pm4rpe4dez3hx26j0f2aj'
            )
        );

        //const tx = await signingStargateClient.signAndBroadcast(
        //'osmo1a9m4a3g7j6mcrahk4pm4rpew4dez3hx26j0f2aj',
        //[],
        //{ amount: { denom: 'uosmo', amount: '100' }, gas: 100000 }
        //);
        const amount = coins(1, 'uosmo');

        const fee = {
            amount: [
                {
                    denom: 'uosmo',
                    amount: '2000'
                }
            ],
            gas: '180000' // 180k
        };

        const tx = await signingStargateClient.sendTokens(
            'osmo1a9m4a3g7j6mcrahk4pm4rpe4dez3hx26j0f2aj',
            'osmo1a9m4a3g7j6mcrahk4pm4rpe4dez3hx26j0f2aj',
            amount,
            fee
        );

        console.log(tx);
    };

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
