import {
    Text,
    Flex,
    VStack,
    HStack,
    Spinner,
    Box,
    Skeleton,
    SkeletonCircle
} from '@chakra-ui/react';
import {
    getChainRestEndpoint,
    getDecimalOfAsset,
    GovernanceProposal,
} from '@consensys/star-fox-sdk';
import { isAfter, isDate } from 'date-fns';
import { useRouter } from 'next/router';
import { useGetTallyQuery } from '../../store/api/chain/api';
import { DonutChart } from 'react-circle-chart';
import BigNumber from 'bignumber.js';
import { Tally } from '@consensys/star-fox-sdk';
import { VoteTotal } from './vote-total';
import { useAppSelector } from '../../store/store';
import { selectChainByChainId } from '../../store/slices/chain.slice';

export const VoteDetail = ({ proposal, chainId }: { chainId: string, proposal: GovernanceProposal }) => {

    const { data: tally, isFetching } = useGetTallyQuery({
        restEndpoint: getChainRestEndpoint(chainId),
        proposalId: proposal.proposal_id
    });
    const chain = useAppSelector(selectChainByChainId(chainId));
    const decimals = getDecimalOfAsset(chainId, chain.symbol);

    const loadChartItems = (
        proposal: GovernanceProposal,
        tally: Tally
    ): Array<{ value: number; label: string }> => {
        if (
            isDate(new Date(Date.parse(proposal.voting_end_time))) &&
            isAfter(Date.parse(proposal.voting_end_time), new Date())
        ) {
            console.log(tally);
            const items = Object.entries(tally).map(([key, value]) => {
                const getVoteTextColor = (voteType: string): string => {
                    switch (voteType) {
                        case 'yes':
                            return '#60d6a7';
                        case 'no':
                            return '#f9a1a4';
                        case 'abstain':
                            return '#747eab';
                        case 'no_with_veto':
                            return '#ff8291';
                        default:
                            return 'black';
                    }
                };

                return {
                    value: parseFloat(
                        new BigNumber(value)
                            .dividedBy(total)
                            .multipliedBy(100)
                            .toPrecision(4)
                    ), //new BigNumber(value).shiftedBy(-decimals).toNumber(),
                    label: key,
                    color: getVoteTextColor(key)
                };
            });
            return items;
        }

        return [];
    };

    const total = tally
        ? Object.values(tally).reduce((acc, count) => {
              return acc.plus(count);
          }, new BigNumber(0))
        : new BigNumber(0);

    return (
        <Flex
            direction="row"
            bg="#f8fafd"
            marginBottom="32px"
            justifyItems="space-between"
            flexGrow={1}
        >
            <VStack>
                <Text marginBottom="auto">Vote Details</Text>
                <HStack></HStack>
                {isFetching && !tally ? (
                    <VStack>
                        <Text>Fetching Votes...</Text>
                        <Skeleton />
                    </VStack>
                ) : (
                    <HStack>
                        <VoteTotal
                            voteType="Yes"
                            amount={tally.yes}
                            total={total}
                            symbol={chain.symbol}
                            decimals={decimals}
                        />
                        <VoteTotal
                            voteType="No"
                            amount={tally.no}
                            total={total}
                            symbol={chain.symbol}
                            decimals={decimals}
                        />
                        <VoteTotal
                            voteType="No with veto"
                            amount={tally.no_with_veto}
                            total={total}
                            symbol={chain.symbol}
                            decimals={decimals}
                        />
                        <VoteTotal
                            voteType="Abstain"
                            amount={tally.abstain}
                            total={total}
                            symbol={chain.symbol}
                            decimals={decimals}
                        />
                    </HStack>
                )}
            </VStack>
            <Flex>
                {isFetching && !tally ? (
                    <VStack>
                        <Text>Fetching Votes...</Text>
                        <SkeletonCircle />
                    </VStack>
                ) : (
                    <DonutChart
                        items={loadChartItems(proposal, tally)}
                        size={150}
                        showTotal={false}
                        trackWidth="sm"
                        trackColor="#c2c8d2"
                        totalTextColor="#979ca5"
                        tooltipFontSize="12px"
                    />
                )}
            </Flex>
        </Flex>
    );
};
