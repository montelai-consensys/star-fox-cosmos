import { Container, Flex, Spinner, Text } from '@chakra-ui/react';
import { Balance } from '../balance/balance';
import { BalanceComponentType, formatBalanceToSymbol } from '@consensys/star-fox-sdk';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { refreshBalanceAction } from '../../store/actions/chain/refreshBalances';
import {
    selectBalances,
    selectChains,
    selectDelegations
} from '../../store/slices/chain.slice';
import { getStakesAction } from 'packages/frontend/store/actions/chain/getStakes';
import { BigNumber } from 'bignumber.js';
import { refreshRewardsAction } from 'packages/frontend/store/actions/chain/refreshRewards';

export const BalancePanel = ({ chainId }) => {
    const [isLoading, setLoading] = useState(true);
    const chains = useAppSelector(selectChains);
    const balances = useAppSelector(selectBalances);
    const delegations = useAppSelector(selectDelegations);
    const dispatch = useAppDispatch();

    if (!chains) {
        return <Spinner />;
    }

    useEffect(() => {
        dispatch(
            refreshBalanceAction({
                address: chains[chainId].address,
                chainId: chainId as string,
                denom: chains[chainId].denom
            })
        );
        dispatch(
            refreshRewardsAction({
                address: chains[chainId].address,
                chainId: chainId as string
            })
        );
        dispatch(getStakesAction({
                address: chains[chainId].address,
                chainId: chainId as string
        }))
    }, [chainId])

    return (

        <Flex flex={1} justifyContent="space-between" width="100%" maxH="150px">
            <Balance
                chainId={chainId}
                denom={chains[chainId].symbol}
                type={BalanceComponentType.Available}
                amount={formatBalanceToSymbol(
                    balances[chainId][chains[chainId].symbol].balance as string,
                    balances[chainId][chains[chainId].symbol].decimal
                ).toString()}
            />
            <Balance
                chainId={chainId}
                denom={chains[chainId].symbol}
                type={BalanceComponentType.Staked}
                amount={formatBalanceToSymbol(
                    chains[chainId].staked as string,
                    balances[chainId][chains[chainId].symbol].decimal
                ).toString()}
            />
            <Balance
                chainId={chainId}
                denom={chains[chainId].symbol}
                type={BalanceComponentType.StakedRewards}
                amount={formatBalanceToSymbol(
                    chains[chainId].rewards as string,
                    balances[chainId][chains[chainId].symbol].decimal
                )}
            />
            <Balance
                chainId={chainId}
                denom={chains[chainId].symbol}
                type={BalanceComponentType.Total}
                amount={formatBalanceToSymbol(
                    new BigNumber(
                        balances[chainId][chains[chainId].symbol].balance as string
                    )
                        .plus(chains[chainId].rewards)
                        .plus(chains[chainId].staked)
                        .toString(),
                    balances[chainId][chains[chainId].symbol].decimal
                )}
            />
        </Flex>
    );
};
