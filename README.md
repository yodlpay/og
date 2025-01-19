# Opengraph renderer for Yodl Payments

This is used to display preview cards in twitter, telegram, etc. It currently powers https://og.yodl.me.

It takes a txId, fetches indexed payment from yodl indexing/scan API and renders an image.

## Getting started

```bash
yarn install
yarn run dev
```

```bash
touch .env
```

Add INDEXER_API_URL to fetch indexed transactions. Ask @yodlpay team for it.

```bash
# .env
INDEXER_API_URL="" 
```

## Endpoint

https://og.yodl.me/tx/10:0xda302360e583f04cc64081da15d7e7bae4c9714325a08cfd71771fa42d28ff38

## txId format

txId consists of `{chainId}:{txHash}`

- `chainId` is the numeric chainId or the shortName (e.g. `eth`, `gno`, `oeth`, `arb1`)
- `txHash` is the transaction hash (of the source transaction)

Notes: chainId is optional and not required currently. It will be useful if you wish to adapt this renderer to fetch data directly on-chain.

