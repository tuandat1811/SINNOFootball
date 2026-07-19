import localFont from "next/font/local";

// Single modern UI typeface (self-hosted — no build-time network dependency).
export const sans = localFont({
  src: [
    { path: "../fonts/InstrumentSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
