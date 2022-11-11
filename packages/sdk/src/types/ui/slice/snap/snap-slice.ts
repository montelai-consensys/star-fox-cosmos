import { CurrentChain } from '../../../metamaskState';
import { SerializedError } from '@reduxjs/toolkit';

export interface TendermintSnapState extends CurrentChain {
  snapId: string;
  snapVersion: string;
  ready: boolean; // Set to true after balances become available for the first time
  actions: {
    [actionPrefix: string]: ActionStatus;
  };
}
export interface ActionStatus {
  processing: boolean;
  result: unknown;
  progress?: number;
  message?: string;
  error: SerializedError;
}
