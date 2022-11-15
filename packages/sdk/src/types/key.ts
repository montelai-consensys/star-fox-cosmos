interface BaseKey {
  name: string;
  chainId: string;
  algo: string;
  bech32Address: string;
  isNanoLedger: boolean; //TODO:  default this to always be false
}

export interface Key extends BaseKey {
  pubKey: Uint8Array;
  address: Uint8Array;
}

export interface KeyDto extends BaseKey {
  base64PubKey: string;
  base64Address: string;
}

export interface GetKeyParams {
  chainId: string;
}

export const fromKeyDto = (keyDto: KeyDto): Key => {
  const key: Key = {
    chainId: keyDto.chainId,
    name: keyDto.name,
    algo: keyDto.algo,
    bech32Address: keyDto.bech32Address,
    pubKey: Buffer.from(keyDto.base64PubKey, 'base64'),
    address: Buffer.from(keyDto.base64Address, 'base64'),
    isNanoLedger: keyDto.isNanoLedger,
  };

  return key;
};
