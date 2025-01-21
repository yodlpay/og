import { PaymentSimple } from "@/lib/indexerClient";
import { format } from "date-fns";
import { ImageResponse } from "next/og";
import truncateEthAddress from "truncate-eth-address";
import { CDN_BASE } from "../constants";

type PreviewCardProps = {
  payment: PaymentSimple;
  outerBgUrl: string | undefined;
  innerBgUrl: string | undefined;
  overlayUrl: string | undefined;
};

async function PreviewCard(props: PreviewCardProps) {
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

  const options = {
    width: 1200,
    height: 630,
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

  const { outerBgUrl, innerBgUrl, payment, overlayUrl } = props;

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

  const outerUrlOrDefault = outerBgUrl || `${CDN_BASE}/og/default/outer.png`;
  const innerUrlOrDefault = innerBgUrl || `${CDN_BASE}/og/default/inner.png`;
  const overlayUrlOrDefault =
    overlayUrl || `${CDN_BASE}/og/default/overlay.png`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 1200,
          height: 630,
          flexDirection: "row",
          paddingTop: 55,
          paddingLeft: 211,
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
          <img
            src={outerUrlOrDefault}
            style={{ width: 1200, height: 630 }}
            alt={""}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 30,
            height: 520,
            width: 778,
            background: "#222325",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              height: 96,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                paddingBottom: 45,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 32, color: "#ccc", marginRight: 5 }}>
                to:
              </span>
              <span style={{ fontSize: 32, color: "#fff" }}>{to} ⚡</span>
              <span style={{ marginLeft: 20, fontSize: 20, color: "#ccc" }}>
                {dateTime}
              </span>
            </div>
            <img
              src={`${CDN_BASE}/logos/yodl/logo-white-on-transparent.svg`}
              style={{ width: 100 }}
              alt={""}
            />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              paddingLeft: 30,
              height: 392,
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
              <img
                src={innerUrlOrDefault}
                style={{
                  width: "718",
                  height: "392",
                }}
                alt={""}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexDirection: "column",
                marginBottom: "auto",
                marginTop: "auto",
                height: 240,
                width: 360,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 90,
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                ${payment.tokenOutAmountGross}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: "400",
                  color: "#fff",
                }}
              >
                <img
                  src={`${CDN_BASE}/logos/tokens/png/${payment.tokenOutSymbol}.png`}
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
          <img src={overlayUrlOrDefault} width="600" height="630" alt={""} />
        </div>
      </div>
    ),
    // @ts-ignore
    options,
  );
}

export default PreviewCard;
