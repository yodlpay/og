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
  BRL: "R$",
};

export function currencyToSymbol(currency: string) {
  // @ts-ignore
  return currencyToSymbolMap[currency];
}

export function formatNumberWithSuffix(num: string | number): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000) {
    const millions = value / 1_000_000;
    return (
      new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 4,
        minimumSignificantDigits: 1,
      }).format(millions) + "M"
    );
  }

  if (absValue >= 1_000) {
    const thousands = value / 1_000;
    return (
      new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 4,
        minimumSignificantDigits: 1,
      }).format(thousands) + "K"
    );
  }

  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 4,
    minimumSignificantDigits: 1,
  }).format(value);
}
