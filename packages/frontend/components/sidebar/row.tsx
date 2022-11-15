import { Flex, Text, Container,  Icon, As } from "@chakra-ui/react";
import {useRouter} from "next/router";

export interface SidebarRowProps {
    imageUrl: As<any>;
    route: string;
    routeName: string
    isSelected: boolean;
}

export const SidebarRow = ({
    imageUrl,
    route,
    routeName,
    isSelected,
}: SidebarRowProps) => {
    const router = useRouter()

    return (
        <Flex
            direction="row"
            paddingX={10}
            alignItems="center"
            onClick={() => router.push(route)}
        >
            {isSelected ?? (
                <Container bg="red" height="40px" width="10px" marginLeft="-20px">
                    test
                </Container>
            )}
            <Icon as={imageUrl} alt={routeName} width="40px" height="40px" borderRadius='full'/>
            <Text marginLeft={10}>{routeName}</Text>
        </Flex>
    );
};

