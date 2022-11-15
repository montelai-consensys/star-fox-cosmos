import {
  AminoMsgDto,
  MetamaskState,
  SignAminoPayload,
} from '@consensys/star-fox-sdk';
import { Secp256k1Wallet, AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { SnapProvider } from '@metamask/snap-types';
import { chains } from 'chain-registry';
import { showConfirmationDialog } from '../utils/confirmation';
import { changeNetwork } from './changeNetwork';

export async function signAmino(
  wallet: SnapProvider,
  state: MetamaskState,
  signAminoPayload: SignAminoPayload
): Promise<AminoSignResponse> {
  const { signerAddress, signDocDto } = signAminoPayload;

  if (signDocDto.chain_id !== state.currentChainId) {
    const chainId = chains.find(
      (chain) => chain.chain_id === signDocDto.chain_id
    ).chain_id;

    if (!chainId) throw new Error(`Unknown Chain ${signDocDto.chain_id}`);
    const [updatedState] = await changeNetwork(wallet, state, {
      chainId,
    });
    state = updatedState;
  }

  const txs = signAminoPayload.signDocDto.msgs.reduce((transactions, msg) => {
    return transactions.concat(`\n${msg.type}`);
  }, '');

  const confirmation = await showConfirmationDialog(wallet, {
    prompt: 'Confirm Transaction',
    description: `Chain: ${signAminoPayload.signDocDto.chain_id}`,
    textAreaContent: txs,
  });

  if (!confirmation) throw new Error('User did not confirm transaction');

  const signDoc: StdSignDoc = {
    ...signDocDto,
    msgs: signDocDto.msgs.map((msg: AminoMsgDto) => {
      return {
        type: msg.type,
        value: Buffer.from(msg.value, 'base64'),
      };
    }),
  };

  //SLIP10Node Interface
  const cosmosNode = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "118'", "0'", '0', '0'],
      curve: 'secp256k1',
    },
  });

  const secp256Wallet: Secp256k1Wallet = await Secp256k1Wallet.fromKey(
    cosmosNode['privateKey']
  );

  const signedAminoResponse: AminoSignResponse = await secp256Wallet.signAmino(
    signerAddress,
    signDoc
  );

  return signedAminoResponse;
}
