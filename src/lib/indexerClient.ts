import { isHex } from "viem";

const INDEXER_API_URL = process.env.INDEXER_API_URL || "/api";

export type PaymentStats = {
  volumeInUSD: number;
  uniqueWallets: number;
  total: number;
};

export type PaymentsPaginationResponse = {
  page: number;
  perPage: number;
  total: number;
  payments: PaymentSimple[];
};

export type PaymentResponse = {
  payment: PaymentSimple;
};

export type PaymentSimple = {
  chainId: number;
  txHash: string;
  paymentIndex: number;
  blockTimestamp: string;

  tokenOutSymbol: string;
  tokenOutAddress: string;
  tokenOutAmountGross: string;
  tokenOutAmountGrossNumber: number;
  tokenOutAmountGrossDn: string;
  receiverAddress: string;
  receiverEnsPrimaryName: string;
  senderAddress: string;
  senderEnsPrimaryName: string;
};

export class PaymentNotFoundError extends Error {}

export async function fetchPaymentByTxHash(
  txHash: string,
): Promise<PaymentResponse> {
  if (!isHex(txHash)) {
    throw new Error("Invalid txHash");
  }

  const url = `${INDEXER_API_URL}/v1/payments/${txHash}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    if (resp.status == 404) {
      throw new PaymentNotFoundError();
    }
    throw new Error("Failure");
  }

  const response = await resp.json();
  return response as PaymentResponse;
}
