import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    Spinner,
    FormLabel,
    FormControl,
    Input,
    Button,
    Text
} from '@chakra-ui/react';
import { siteConfig } from 'packages/frontend/config/siteConfig';
import { useMetamaskFlask } from 'packages/frontend/connector/metamask';
import {selectSnapState} from 'packages/frontend/store/slices/snap.slice';
import {useAppSelector} from 'packages/frontend/store/store';
import { useState } from 'react';

export const SendModal = ({  onOpen, onClose, isOpen }) => {
    const flask = useMetamaskFlask();
    const snapState = useAppSelector(selectSnapState)

    const [amountToSend, setAmount] = useState('0');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [memo, setMemo] = useState(null);
    const [sending, setSending] = useState(false);
    const [transferResult, setTransferResult] = useState(null);
    const handleSend = async e => {
        event.preventDefault();
        setTransferResult(null);
        setSending(true);
        const result = await flask.provider.request({
            method: 'wallet_invokeSnap',
            params: [
                siteConfig.snapId,
                {
                    method: 'transfer',
                    params: {
                        chainName: snapState.currentChain,
                        amount: amountToSend,
                        recipient: destinationAddress,
                        memo: memo,
                        fee: null
                    }
                }
            ]
        });
        console.log(result);
        setTransferResult(result);
        setSending(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Transfer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Destination Address</FormLabel>
                            <Input
                                placeholder="Destination Address"
                                onChange={e => setDestinationAddress(e.target.value)}
                                value={destinationAddress}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Amount</FormLabel>
                            <Input
                                placeholder="Amount to send"
                                onChange={e => setAmount(e.target.value)}
                                value={amountToSend}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Memo</FormLabel>
                            <Input
                                placeholder="Memo"
                                onChange={e => setMemo(e.target.value)}
                                value={memo}
                            />
                        </FormControl>
                    </ModalBody>

                    {sending && <Spinner alignSelf="center" />}
                    {transferResult && (
                        <Text padding={2}>
                            Transfer successful. Txhash: {transferResult.transactionHash}
                        </Text>
                    )}

                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            mr={3}
                            onClick={() => {
                                setTransferResult(null);
                                setDestinationAddress('');
                                setAmount('0');
                                onClose();
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            colorScheme="green"
                            onClick={async e => {
                                await handleSend(e);
                            }}
                            disabled={transferResult}
                        >
                            Send
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
