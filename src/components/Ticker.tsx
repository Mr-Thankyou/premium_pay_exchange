"use client";

import { useEffect } from "react";

export default function Ticker() {
  useEffect(() => {
    const container = document.getElementById("ticker-container");
    if (!container) return;

    // remove old widget script if present (useful during HMR/dev)
    const existing = container.querySelector("script");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
        { proName: "COINBASE:ETHUSD", title: "ETH/USD" },
        { proName: "FOREXCOM:EURUSD", title: "EUR/USD" },
        { proName: "FOREXCOM:GBPUSD", title: "GBP/USD" },
        { proName: "OANDA:XAUUSD", title: "GOLD" },
        { proName: "INDEX:SPX", title: "S&P 500" },
        { proName: "NASDAQ:NDX", title: "Nasdaq 100" },
      ],
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });

    container.appendChild(script);
  }, []);

  return (
    <div
      id="ticker-container"
      style={{
        width: "100%",
        height: 48,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    />
  );
}
