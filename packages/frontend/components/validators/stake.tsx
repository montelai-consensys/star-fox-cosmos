import { Button, Flex, Text, Tr, Td } from '@chakra-ui/react';

export const Stake = ({ chainId, delegation }) => {

    return (
        <Tr>
            <Td>{delegation.delegation.validator_address}</Td>
            <Td>{delegation.delegation.shares}</Td>
            <Td>
                <Button>Manage</Button>
            </Td>
        </Tr>
    );
};
