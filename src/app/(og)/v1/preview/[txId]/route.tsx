"use server";

import { type NextRequest } from "next/server";
import { fetchPaymentByTxHash } from "@/lib/indexerClient";
import urlExist from "url-exist";
import PreviewCard from "@/app/components/PreviewCard";
import { splitTxId, urlIfExists } from "@/lib/util";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txId: string }> },
) {
  const { txId } = await params;
  const { chainId, txHash } = splitTxId(txId);

  const searchParams = request.nextUrl.searchParams;

  try {
    const { payment } = await fetchPaymentByTxHash(txHash);

    let outerBgUrl, innerBgUrl, overlayUrl;

    const outerBg = searchParams.get("outer");
    const innerBg = searchParams.get("inner");
    const overlay = searchParams.get("overlay");
    const baseUrl = searchParams.get("baseUrl");

    if (baseUrl) {
      // vercel next/og fails when trying to load an image that does not exist.
      outerBgUrl = await urlIfExists(`${baseUrl}/outer.png`);
      innerBgUrl = await urlIfExists(`${baseUrl}/inner.png`);
      overlayUrl = await urlIfExists(`${baseUrl}/overlay.png`);
      console.log("baseUrl", baseUrl);
    } else {
      // vercel next/og fails when trying to load an image that does not exist.
      outerBgUrl = await urlIfExists(outerBg);
      innerBgUrl = await urlIfExists(innerBg);
      overlayUrl = await urlIfExists(overlay);
    }

    return PreviewCard({ payment, outerBgUrl, innerBgUrl, overlayUrl });
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
