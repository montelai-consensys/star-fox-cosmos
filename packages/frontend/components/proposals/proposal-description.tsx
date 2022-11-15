import { Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';

export const ProposalDescription = ({ chainName, description }: { chainName: string, description: string }) => {
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            bg="#fbfcfe"
            marginTop="32px"
        >
            <Text marginBottom={3} color="#d6daec" fontSize={'12px'} fontWeight={500}>
                Description
            </Text>
            <Text color="#747eab" fontSize={'14px'} fontWeight={400}>
                {description}
            </Text>
            <Text
                color="#56608b"
                fontWeight="semibold"
                marginTop="32px"
                marginBottom="20px"
            >
                Governance Votes
            </Text>
            <Text color="#56608b">
                The following items summarize the voting options and what it means for
                this proposal:
            </Text>
            <UnorderedList color="#56608b" marginTop="10px">
                <ListItem>
                    YES - You approve of and wish to ratify the contents of the proposed
                    paper{' '}
                </ListItem>
                <ListItem>
                    NO - You don’t approve of the contents of paper. Please indicate why
                    on the {chainName} forum.
                </ListItem>
                <ListItem>
                    NO WITH VETO - A ‘NoWithVeto’ vote indicates a proposal either (1) is
                    deemed to be spam, i.e., irrelevant to {chainName}, (2)
                    disproportionately infringes on minority interests, or (3) violates or
                    encourages violation of the rules of engagement as currently set out
                    by {chainName} governance. If the number of ‘NoWithVeto’ votes is
                    greater than a third of total votes, the proposal is rejected and the
                    deposits are burned.
                </ListItem>
                <ListItem>
                    ABSTAIN - You wish to contribute to quorum but you formally decline to
                    vote either for or against the proposal.
                </ListItem>
            </UnorderedList>
        </Flex>
    );
};
