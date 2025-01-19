import { type NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import truncateEthAddress from "truncate-eth-address";
import { format } from "date-fns";
import { fetchPaymentByTxHash } from "@/lib/indexerClient";
import Image from "next/image";

export const runtime = "edge";

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
  ).then((res) => res.arrayBuffer());

  const SFProDisplayMedium = fetch(
    new URL(
      "https://cdn.jsdelivr.net/npm/sf-font@1.0.0/SFProDisplay-Medium.ttf",
    ),
  ).then((res) => res.arrayBuffer());

  const { payment } = await fetchPaymentByTxHash(txHash);

  const {
    receiverAddress,
    receiverEnsPrimaryName,
    senderAddress,
    senderEnsPrimaryName,
  } = payment;

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

    let bg = `linear-gradient(to right, #505050, #222325)`;
    if (payment.receiverEnsPrimaryName == "100usdglo.yodl.eth") {
      bg = `url(${cdnBase}/logos/receipts/paddlebattle.png)`;
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: 1200,
            height: 800,
            flexDirection: "row",
            background: "linear-gradient(to right, #505050, #222325, #313131)",
            paddingTop: 80,
            paddingLeft: 120,
          }}
        >
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

              <Image
                src={`${cdnBase}/logos/yodl/logo-white-on-transparent.svg`}
                style={{ width: 100 }}
                alt={""}
              />
            </div>

            <div
              style={{
                display: "flex",
                background: bg,
                backgroundSize: "100% 483px",
                backgroundRepeat: "no-repeat",
                marginTop: "auto",
                paddingLeft: 40,
                height: "483",
                alignItems: "center",
              }}
            >
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
                  <Image
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
        </div>
      ),
      // @ts-ignore
      options,
    );
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
