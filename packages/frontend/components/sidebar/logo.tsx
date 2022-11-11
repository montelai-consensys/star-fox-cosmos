import { Flex,  Text } from "@chakra-ui/react";
import  Image  from 'next/image'
import {useRouter} from "next/router";

export const Logo = () => {
    const router = useRouter()
    return (
        <Flex
            //width={180}
            maxH={60}
            paddingTop={"36px"}
            paddingX={"24px"}
            paddingBottom={"20"}
            direction="row"
            alignItems="center"
        >
            <Image
                width="40px"
                height="40px"
                src="/assets/star-fox.png"
                alt="Star Fox Wallet Logo"
                onClick={()=>router.push('/')}
            />
            <Text paddingLeft={10}>Star Fox Wallet</Text>
        </Flex>
    );
};
