import { Flex, Text, Container, Image } from "@chakra-ui/react";
import { Chain } from '@chain-registry/types'

export interface SidebarRowProps {
    imageUrl: string;
    chainName: string;
    chain: Chain;
    isSelected: boolean;
    onClick: Function;
}

export const SidebarRow = ({
    imageUrl,
    chainName,
    chain,
    isSelected,
    onClick
}: SidebarRowProps) => {
    const handleChainSelect = () => {
        onClick(chainName);
    };

    return (
        <Flex
            direction="row"
            paddingX={10}
            alignItems="center"
            onClick={() => handleChainSelect()}
        >
            {isSelected ?? (
                <Container bg="red" height="40px" width="10px" marginLeft="-20px">
                    test
                </Container>
            )}
            <Image src={imageUrl} alt={`${chainName[0].toUpperCase()}${chainName.slice(1)} logo`} width="40px" height="40px" borderRadius='full'/>
            <Text marginLeft={10}>{`${chainName[0].toUpperCase()}${chainName.slice(1)}`}</Text>
        </Flex>
    );
};

