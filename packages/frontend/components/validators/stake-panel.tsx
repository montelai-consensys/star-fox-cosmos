import { selectDelegations } from '../../store/slices/chain.slice';
import { useAppSelector } from '../../store/store';
import {
    Flex,
    Table,
    TableContainer,
    Tbody,
    Text,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { Stake } from './stake';

export const StakePanel = ({ chainId }) => {
    const delegations = useAppSelector(selectDelegations);

    return (
        <Flex direction="column" flex={1} width="100%">
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Validator</Th>
                            <Th>Amount Staked</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {Object.keys(delegations[chainId]).map((delegation, index) => {
                            return (
                                <Stake
                                    key={`delegation-${index}`}
                                    chainId={chainId}
                                    delegation={delegations[chainId][index]}
                                />
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    );
};
