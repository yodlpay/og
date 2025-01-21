"use server";

import { type NextRequest } from "next/server";
import { fetchPaymentByTxHash } from "@/lib/indexerClient";
import PreviewCard from "@/app/components/PreviewCard";

import { splitTxId, urlIfExists } from "@/lib/util";
import { CDN_BASE } from "@/app/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txId: string }> },
) {
  const { txId } = await params;
  const { chainId, txHash } = splitTxId(txId);

  try {
    const { payment } = await fetchPaymentByTxHash(txHash);
    const { receiverYodlConfig } = payment;

    let outerBgUrl, innerBgUrl, overlayUrl;

    const ogConfig = receiverYodlConfig?.og;

    if (
      payment.receiverEnsPrimaryName == "100usdglo.yodl.eth" &&
      !ogConfig?.baseUrl
    ) {
      overlayUrl = await urlIfExists(
        `${CDN_BASE}/og/100usdglo.yodl.eth/overlay.png`,
      );
      outerBgUrl = await urlIfExists(
        `${CDN_BASE}/og/100usdglo.yodl.eth/inner.png`,
      );
      innerBgUrl = await urlIfExists(
        `${CDN_BASE}/og/100usdglo.yodl.eth/outer.png`,
      );
    }

    if (ogConfig && ogConfig.baseUrl) {
      const baseUrl = ogConfig.baseUrl;
      // vercel next/og fails when trying to load an image that does not exist.
      outerBgUrl = await urlIfExists(`${baseUrl}/inner.png`);
      innerBgUrl = await urlIfExists(`${baseUrl}/outer.png`);
      overlayUrl = await urlIfExists(`${baseUrl}/overlay.png`);
    } else if (ogConfig) {
      // vercel next/og fails when trying to load an image that does not exist.
      outerBgUrl = await urlIfExists(ogConfig.outer);
      innerBgUrl = await urlIfExists(ogConfig.inner);
      overlayUrl = await urlIfExists(ogConfig.overlay);
    } else {
      outerBgUrl = await urlIfExists(`${CDN_BASE}/og/default/inner.png`);
      innerBgUrl = await urlIfExists(`${CDN_BASE}/og/default/outer.png`);
      overlayUrl = await urlIfExists(`${CDN_BASE}/og/default/overlay.png`);
    }

    return PreviewCard({ payment, outerBgUrl, innerBgUrl, overlayUrl });
  } catch (e: any) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
