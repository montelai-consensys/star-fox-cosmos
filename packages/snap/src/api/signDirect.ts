import {
  MetamaskState,
  SignDirectPayload,
  SignDirectResponseDto,
} from '@consensys/star-fox-sdk';
import {
  DirectSecp256k1Wallet,
  DirectSignResponse,
} from '@cosmjs/proto-signing';
import { SnapProvider } from '@metamask/snap-types';
import { chains } from 'chain-registry';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';
import { showConfirmationDialog } from '../utils/confirmation';
import { changeNetwork } from './changeNetwork';

export async function signDirect(
  wallet: SnapProvider,
  state: MetamaskState,
  signDirectPayload: SignDirectPayload
): Promise<SignDirectResponseDto> {
  const { signerAddress, signDocDto } = signDirectPayload;

  const confirmation = await showConfirmationDialog(wallet, {
    prompt: 'Confirm Transaction',
    description: `Chain: ${signDocDto.chainId}`,
    textAreaContent: `Data: ${signDocDto.bodyBytes}`,
  });

  if (signDocDto.chainId !== state.currentChainId) {
    const [updatedState] = await changeNetwork(wallet, state, {
      chainId: signDocDto.chainId,
    });
    state = updatedState;
  }

  if (!confirmation) throw new Error('User did not confirm transaction');

  const signDoc: SignDoc = {
    bodyBytes: Buffer.from(signDocDto.bodyBytes, 'base64'),
    authInfoBytes: Buffer.from(signDocDto.authInfoBytes, 'base64'),
    accountNumber: Long.fromString(signDocDto.accountNumber),
    chainId: signDocDto.chainId,
  };

  //SLIP10Node Interface
  const cosmosNode = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "118'", "0'", '0', '0'],
      curve: 'secp256k1',
    },
  });

  const directSecp256k1Wallet: DirectSecp256k1Wallet =
    await DirectSecp256k1Wallet.fromKey(
      Buffer.from(cosmosNode['privateKey'], 'hex'),
      state.networks[signDocDto.chainId].bech32_prefix
    );

  const signedDocResponse: DirectSignResponse =
    await directSecp256k1Wallet.signDirect(signerAddress, signDoc);

  const signedDirectResponseDto: SignDirectResponseDto = {
    signDocDto,
    signature: {
      signature: signedDocResponse.signature.signature,
      pubKey: {
        type: signedDocResponse.signature.pub_key.type,
        value: Buffer.from(signedDocResponse.signature.pub_key.value).toString(
          'base64'
        ),
      },
    },
  };

  return signedDirectResponseDto;
}
