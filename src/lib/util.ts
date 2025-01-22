import urlExist from "url-exist";

export async function urlIfExists(url: string | undefined | null) {
  if (url) {
    return (await urlExist(url)) ? url : undefined;
  }
}

export function splitTxId(txId: string) {
  const splitId = txId.split(":");
  let chainId;
  let txHash;
  if (splitId.length == 1) {
    txHash = splitId[0];
  } else {
    chainId = splitId[0];
    txHash = splitId[1];
  }

  return { chainId, txHash };
}

const currencyToSymbolMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  KRW: "₩",
  THB: "฿",
  VND: "₫",
  IDR: "Rp",
  MYR: "RM",
  PHP: "₱",
  SGD: "S$",
  HKD: "HK$",
  NZD: "NZ$",
};

export function currencyToSymbol(currency: string) {
  // @ts-ignore
  return currencyToSymbolMap[currency];
}
