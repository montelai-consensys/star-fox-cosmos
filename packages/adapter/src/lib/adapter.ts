import {
  AccountData,
  Algo,
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {
  SignDirectPayload,
  SignDocDto,
  SignAminoDocDto,
  SignAminoPayload,
  SignDirectResponseDto,
  KeyDto,
  Key,
  GetKeyParams,
  fromKeyDto,
} from '@consensys/star-fox-sdk';
import Long from 'long';

interface IntermediateAccountData {
  address: string;
  algo: Algo;
  pubkey: string;
}

export class MetamaskTendermintOfflineSigner
  implements OfflineAminoSigner, OfflineDirectSigner
{
  constructor(
    readonly provider: MetaMaskInpageProvider,
    readonly snapId: string
  ) {}

  async getAccounts(): Promise<AccountData[]> {
    const intermediateAccountData = (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: [
        this.snapId,
        {
          method: 'starFoxSnap_getAccount',
        },
      ],
    })) as IntermediateAccountData;

    const accountData: AccountData = {
      ...intermediateAccountData,
      pubkey: Buffer.from(intermediateAccountData.pubkey, 'base64'),
    };
    return [accountData];
  }

  async signAmino(
    signerAddress: string,
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse> {
    const signDocDto: SignAminoDocDto = {
      chain_id: signDoc.chain_id,
      account_number: signDoc.account_number,
      sequence: signDoc.chain_id,
      fee: signDoc.fee,
      msgs: signDoc.msgs.map((msg) => {
        return {
          type: msg.type,
          value: Buffer.from(msg.value).toString('base64'),
        };
      }),
      memo: signDoc.memo,
    };

    const signAminoPayload: SignAminoPayload = {
      signDocDto,
      signerAddress,
    };

    const aminoSignResponse = (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: [
        this.snapId,
        {
          method: 'starFoxSnap_signDirect',
          params: signAminoPayload,
        },
      ],
    })) as AminoSignResponse;
    return aminoSignResponse;
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    const signDocDto: SignDocDto = {
      bodyBytes: Buffer.from(signDoc.bodyBytes).toString('base64'),
      chainId: signDoc.chainId,
      accountNumber: signDoc.accountNumber.toString(),
      authInfoBytes: Buffer.from(signDoc.authInfoBytes).toString('base64'),
    };

    const signDirectPayload: SignDirectPayload = {
      signerAddress,
      signDocDto,
    };

    const directSignResponseDto = (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: [
        this.snapId,
        {
          method: 'starFoxSnap_signDirect',
          params: signDirectPayload,
        },
      ],
    })) as SignDirectResponseDto;

    const directSignResponse: DirectSignResponse = {
      signature: {
        signature: directSignResponseDto.signature.signature,
        pub_key: {
          ...directSignResponseDto.signature.pubKey,
          value: Buffer.from(
            directSignResponseDto.signature.pubKey.value,
            'base64'
          ),
        },
      },
      signed: {
        ...directSignResponseDto.signDocDto,
        bodyBytes: Buffer.from(
          directSignResponseDto.signDocDto.bodyBytes,
          'base64'
        ),
        authInfoBytes: Buffer.from(
          directSignResponseDto.signDocDto.authInfoBytes,
          'base64'
        ),
        accountNumber: Long.fromString(
          directSignResponseDto.signDocDto.accountNumber
        ),
        chainId: directSignResponseDto.signDocDto.chainId,
      },
    };

    return directSignResponse;
  }

  async getKey(chainId: string): Promise<Key> {
    const getKeyParams: GetKeyParams = {
      chainId: chainId,
    };

    const keyDto: KeyDto = (await this.provider.request({
      method: 'wallet_invokeSnap',
      params: [
        this.snapId,
        {
          method: 'starFoxSnap_getKey',
          params: getKeyParams,
        },
      ],
    })) as KeyDto;

    const key: Key = fromKeyDto(keyDto);
    return key;
  }
}
