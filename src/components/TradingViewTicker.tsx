"use client";

import { useEffect } from "react";

export default function TradingViewTicker() {
  useEffect(() => {
    // Prevent script from loading twice
    if (document.getElementById("tradingview-ticker-script")) return;

    const script = document.createElement("script");
    script.id = "tradingview-ticker-script";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
        { proName: "BITSTAMP:ETHUSD", title: "ETH/USD" },
      ],
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "regular",
      locale: "en",
    });

    document
      .getElementById("tradingview-widget-container")
      ?.appendChild(script);
  }, []);

  return (
    <div
      id="tradingview-widget-container"
      style={{ width: "100%", overflow: "hidden" }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
