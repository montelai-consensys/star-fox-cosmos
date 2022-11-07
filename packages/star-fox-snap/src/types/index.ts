import { TransferPayload } from './transfers';

export * from './transfers';

export type RequestParam = {
  method: string;
  params?: { chainName: string } | TransferPayload;
};
