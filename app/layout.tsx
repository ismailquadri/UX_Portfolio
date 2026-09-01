import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter-tight",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Quadri Ismail — Product Designer",
  description: "A product designer based in Lagos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${interTight.variable} ${instrumentSerif.variable}`}
      >
        <body>
          <SmoothScrollProvider>
            <PageTransition>{children}</PageTransition>
          </SmoothScrollProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
