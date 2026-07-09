import type { Metadata } from "next";
import { Jost, Libre_Baskerville } from "next/font/google";
import "./globals.css";

// Jost ≈ ITC Avant Garde Gothic Pro (geometric, Futura-derived) for headings.
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Libre Baskerville ≈ Baskerville Display PT for elegant serif display copy.
const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-baskerville",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Instant Free Estimate | Archadeck of Chicagoland",
  description:
    "Tell us a little about your project and get a transparent price range in under two minutes — no phone call, no obligation.",
  openGraph: {
    title: "Instant Free Estimate | Archadeck of Chicagoland",
    description:
      "Get a transparent price range for your deck, porch, or patio in under two minutes.",
    images: [
      "https://www.archadeck.com/images/social/Social-Share.2101050844288.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jost.variable} ${baskerville.variable}`}>
      <body>{children}</body>
    </html>
  );
}
