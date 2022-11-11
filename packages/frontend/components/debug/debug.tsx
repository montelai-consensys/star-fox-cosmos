import { Button, Container } from '@chakra-ui/react';
import { useAppDispatch } from '../../store/store';
import { useMetamaskFlask } from '../../connector/metamask';
import { changeNetworkAction } from '../../store/actions/snap/changeNetwork';
import { installSnap } from 'packages/frontend/utils/installSnap';
import { siteConfig } from 'packages/frontend/config/siteConfig';
import { useState } from 'react';

export const Debug = () => {
    const flask = useMetamaskFlask();
    const dispatch = useAppDispatch();
    const [showDebug, setShowDebug] = useState(true);
    const showDebugPanel = () => {
        return (
            <>
                <Button
                    key="install"
                    onClick={async () => {
                        await installSnap(flask.provider);
                    }}
                >
                    {'install'}
                </Button>
                <Button
                    key="ping"
                    onClick={async () => {
                        await flask.provider.request({
                            method: 'wallet_invokeSnap',
                            params: [
                                siteConfig.snapId,
                                {
                                    method: 'hello'
                                }
                            ]
                        });
                    }}
                >
                    {'send ping'}
                </Button>
                <Button
                    onClick={async () => {
                                await flask.provider.request({
            method: 'wallet_invokeSnap',
            params: [
                siteConfig.snapId,
                {
                    method: 'transfer',
                    params: {
                        chainName:"osmosis",
                        amount: "123",
                        recipient: "osmo1a9m4a3g7j6mcrahk4pm4rpe4dez3hx26j0f2aj",
                        memo: null,
                        fee: null
                    }
                }
            ]
        });

                        console.log();
                    }}
                >
                    {'send token'}
                </Button>
                <Button
                    onClick={() => {
                        console.log();
                    }}
                >
                    {'get balance'}
                </Button>
                <Button
                    onClick={async () => {
                        await flask.provider.request({
                            method: 'wallet_invokeSnap',
                            params: [
                                siteConfig.snapId,
                                {
                                    method: 'reset'
                                }
                            ]
                        });
                    }}
                >
                    Reset Account
                </Button>
                <Button
                    onClick={() =>
                        dispatch(changeNetworkAction({ chainName: 'cosmoshub' }))
                    }
                >
                    Change to Atom
                </Button>
                <Button
                    onClick={() =>
                        dispatch(changeNetworkAction({ chainName: 'osmosis' }))
                    }
                >
                    Change to osmosis
                </Button>
                <Button
                    onClick={() => {
                        console.log();
                    }}
                >
                    Get Accounts Stargate
                </Button>
            </>
        );
    };

    return (
        <Container display="flex" alignItems="center" flexDirection="column">
            <Button
                onClick={() => {
                    setShowDebug(!showDebug);
                }}
            >{`${showDebug ? 'Hide' : 'Show'} Debug`}</Button>
            {showDebug && showDebugPanel()}
        </Container>
    );
};
