"use server";

import { type NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import truncateEthAddress from "truncate-eth-address";
import { format } from "date-fns";
import { fetchPaymentByTxHash } from "@/lib/indexerClient";
import urlExist from "url-exist";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txId: string }> },
) {
  const { txId } = await params;

  const splitId = txId.split(":");
  let chainId;
  let txHash;
  if (splitId.length == 1) {
    txHash = splitId[0];
  } else {
    chainId = splitId[0];
    txHash = splitId[1];
  }

  // Font
  const SFProDisplayBold = fetch(
    new URL("https://cdn.jsdelivr.net/npm/sf-font@1.0.0/SFProDisplay-Bold.ttf"),
    { cache: "force-cache" },
  ).then((res) => res.arrayBuffer());

  const SFProDisplayMedium = fetch(
    new URL(
      "https://cdn.jsdelivr.net/npm/sf-font@1.0.0/SFProDisplay-Medium.ttf",
    ),
    { cache: "force-cache" },
  ).then((res) => res.arrayBuffer());

  const { payment } = await fetchPaymentByTxHash(txHash);
  const {
    receiverAddress,
    receiverEnsPrimaryName,
    receiverYodlConfig,
    senderAddress,
    senderEnsPrimaryName,
  } = payment;

  console.log(payment);

  const to = receiverEnsPrimaryName || truncateEthAddress(receiverAddress);
  const from = senderEnsPrimaryName || truncateEthAddress(senderAddress);

  const blockTimestamp = payment.blockTimestamp;

  const dateTime = format(blockTimestamp || new Date(), "yyyy-MM-dd h:mm");
  const cdnBase =
    "https://raw.githubusercontent.com/yodlpay/assets/refs/heads/main/";

  try {
    const options = {
      width: 1200,
      height: 800,
      alt: "yodl",
      fonts: [
        {
          name: "SF Pro",
          data: await SFProDisplayBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "SF Pro",
          data: await SFProDisplayMedium,
          style: "normal",
          weight: 400,
        },
      ],
    };

    const outerBg = `linear-gradient(to right, #505050, #222325)`;
    const innerBg = "linear-gradient(to right, #505050, #222325, #313131)";

    let outerBgUrl, innerBgUrl, overlayUrl;

    if (payment.receiverEnsPrimaryName == "100usdglo.yodl.eth") {
      innerBgUrl = `${cdnBase}/logos/receipts/paddlebattle.png`;
    }

    const ogConfig = receiverYodlConfig?.og;
    if (ogConfig) {
      // vercel next/og fails when trying to load an image that does not exist.
      outerBgUrl = (await urlExist(ogConfig.outerBg)) ? ogConfig.outerBg : null;
      innerBgUrl = (await urlExist(ogConfig.innerBg)) ? ogConfig.innerBg : null;
      overlayUrl = (await urlExist(ogConfig.overlay)) ? ogConfig.overlay : null;
    }

    console.log({ ogConfig });

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: 1200,
            height: 800,
            flexDirection: "row",

            paddingTop: 80,
            paddingLeft: 120,
          }}
        >
          <div
            style={{
              background: outerBg,
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {outerBgUrl && (
              <img
                src={outerBgUrl}
                style={{ width: 1200, height: 800 }}
                alt={""}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 40,
              height: 640,
              width: 960,
              background: "#222325",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                height: 45,
                width: "100%",
                color: "#fff",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 32, color: "#fff" }}>to: {to} ⚡</span>
                <span style={{ marginLeft: 20, fontSize: 20, color: "#ccc" }}>
                  {dateTime}
                </span>
              </div>
              <img
                src={`${cdnBase}/logos/yodl/logo-white-on-transparent.svg`}
                style={{ width: 100 }}
                alt={""}
              />
            </div>
            <div
              style={{
                display: "flex",
                backgroundSize: "880 480px",
                backgroundRepeat: "no-repeat",
                marginTop: "auto",
                paddingLeft: 40,
                height: "480",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: innerBg,
                  display: "flex",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                {innerBgUrl && (
                  <img
                    src={innerBgUrl}
                    style={{
                      width: "880",
                      height: "480",
                    }}
                    alt={""}
                  />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexDirection: "column",
                  marginBottom: "auto",
                  marginTop: "auto",
                  height: 240,
                  width: 406,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 99,
                    fontWeight: "700",
                    color: "#fff",
                  }}
                >
                  ${payment.tokenOutAmountGross}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 32,
                    fontWeight: "400",
                    color: "#fff",
                  }}
                >
                  <img
                    src={`${cdnBase}/logos/tokens/png/${payment.tokenOutSymbol}.png`}
                    width="40"
                    height="40"
                    style={{ marginRight: 15, height: 40, width: 40 }}
                    alt={""}
                  />
                  ${payment.tokenOutAmountGross} {payment.tokenOutSymbol}
                </div>
                <div
                  style={{
                    display: "flex",
                    paddingTop: 10,
                    marginTop: 10,
                    width: "90%",
                    borderTop: "1px solid #888",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 36, fontWeight: "400", color: "#fff" }}
                  >
                    →
                  </span>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: "400",
                      color: "#fff",
                      marginLeft: 25,
                    }}
                  >
                    {" "}
                    from: {from}
                  </span>
                </div>
                {/* <div style={{ display: 'flex', fontSize: 32, fontWeight: "400", color: "#fff" }}>${simple.tokenOutAmountGross}</div> */}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 600,
              right: 0,
              bottom: 0,
            }}
          >
            {overlayUrl && (
              <img
                src={overlayUrl}
                width="600"
                height="800"
                alt={""}
              />
            )}
          </div>
        </div>
      ),
      // @ts-ignore
      options,
    );
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
