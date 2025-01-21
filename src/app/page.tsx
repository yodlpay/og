"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [baseUrl, setBaseUrl] = useState(
    "https://cdn.jsdelivr.net/gh/yodlpay/assets/og/default",
  );

  const previewUrl = `/v1/preview/0x3ee275ae7504f206273f1a0f2d6bfbffda962c028542a8425ef9ca602d85a364?baseUrl=${encodeURIComponent(baseUrl)}`;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>yodl opengraph</h1>
        <p>API server to generate opengraph images for yodl payments.</p>

        <h2>Live Preview</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="baseUrl" style={{ marginBottom: 5 }}>
              <pre>baseURL</pre>
            </label>
            <input
              type="text"
              id="baseUrl"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 5,
                border: "1px solid #ccc",
                marginBottom: 10,
              }}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="Enter inner background URL"
            />
            <p style={{ marginBottom: 5 }}>
              Preview card will use the following assets:
            </p>
            <ul>
              <li>
                <pre>{`${baseUrl}/outer.png`}</pre>
              </li>
              <li>
                <pre>{`${baseUrl}/inner.png`}</pre>
              </li>
              <li>
                <pre>{`${baseUrl}/overlay.png`}</pre>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <img
              src={previewUrl}
              width="600"
              height="315"
              alt="Preview"
              className="rounded shadow-lg"
            />
          </div>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
