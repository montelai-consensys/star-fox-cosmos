import { SnapProvider } from '@metamask/snap-types';

export interface ConfirmationDialogContent {
  prompt: string;
  description?: string;
  textAreaContent?: string;
}

export async function showConfirmationDialog(
  wallet: SnapProvider,
  message: ConfirmationDialogContent
) {
  return await wallet.request({
    method: 'snap_confirm',
    params: [message],
  });
}
