import {
    Text,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';

export const SnapInstallAlert = ({ isOpen, onOpen, onClose }) => {
    const router = useRouter();
    const cancelRef = useRef();

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            <Text>You dont have the MetaMask Flask extension</Text>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            You need to install MetaMask Flask extension in order to use
                            the StarkNet Snap.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                            colorScheme={"blue"}
                                onClick={() => router.push('https://metamask.io/flask/')}
                            >Install Metamask Flask</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};
