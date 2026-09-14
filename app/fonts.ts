import { Instrument_Sans } from "next/font/google";

// Instrument Sans — matches the Laravel design system (weights 400/500/600),
// self-hosted by next/font and exposed as the --font-instrument CSS variable
// which globals.css maps onto --font-sans / --font-display.
export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});
