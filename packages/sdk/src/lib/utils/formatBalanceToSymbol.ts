import { BigNumber } from 'bignumber.js';

export const formatBalanceToSymbol = (
  balance: string,
  decimal: number
): BigNumber => {
  const newBalance = new BigNumber(balance).shiftedBy(-decimal);
  return newBalance;
};
