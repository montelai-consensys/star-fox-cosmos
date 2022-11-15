import { Flex } from '@chakra-ui/react';
import { selectBalances, selectChains } from 'packages/frontend/store/slices/chain.slice';
import { selectSnapState } from 'packages/frontend/store/slices/snap.slice';
import { useAppSelector } from 'packages/frontend/store/store';
import { Asset } from './asset';

export const AssetsPanel = ({ chainId }) => {
    const balances = useAppSelector(selectBalances);
    const chains = useAppSelector(selectChains)

    return (
        <Flex direction="column" flex={1} width="100%">
            {Object.keys(balances[chainId]).map(assetName => {
                return (
                    <Asset
                        key={assetName}
                        chainId={chainId}
                        imageURI={balances[chainId][assetName].imageURI}
                        symbol={balances[chainId][assetName].symbol}
                        decimal={balances[chainId][assetName].decimal}
                        amount={balances[chainId][assetName].balance}
                    />
                );
            })}
        </Flex>
    );
};
