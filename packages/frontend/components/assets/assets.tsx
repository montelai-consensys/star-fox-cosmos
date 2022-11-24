import { Flex, HStack, Switch, Text } from '@chakra-ui/react';
import { selectBalances} from 'packages/frontend/store/slices/chain.slice';
import { useAppSelector } from 'packages/frontend/store/store';
import {useState} from 'react';
import { Asset } from './asset';
import {BigNumber} from 'bignumber.js'

export const AssetsPanel = ({ chainId }) => {
    const balances = useAppSelector(selectBalances);
    const [showAllAssets, setShowAllAssetsToggle] = useState(true)

    return (
        <Flex direction="column" flex={1} width="100%">

            <HStack justifySelf="flex-end" mb={5}><Text>Show Assets With Small Balances</Text><Switch isChecked={showAllAssets} onChange={() => setShowAllAssetsToggle(!showAllAssets)}/></HStack>
            {showAllAssets ? Object.keys(balances[chainId]).map(assetName => {
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
            }): Object.keys(balances[chainId]).filter(assetName => new BigNumber(balances[chainId][assetName].balance).gt(new BigNumber(0))).map(assetName => {
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
