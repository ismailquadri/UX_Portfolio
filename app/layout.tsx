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
	metadataBase: new URL("https://quadriismail.com"),
	title: {
		default: "Quadri Ismail — Product Designer",
		template: "%s | Quadri Ismail",
	},
	description: "Quadri Ismail is a product designer in Lagos, Nigeria, who turns complex workflows into clear product experiences across FinTech, AI-native products, GovTech, and enterprise SaaS.",
	applicationName: "Quadri Ismail Portfolio",
	openGraph: {
		type: "website",
		locale: "en_NG",
		url: "https://quadriismail.com",
		siteName: "Quadri Ismail",
		title: "Quadri Ismail — Product Designer for Complex Products",
		description: "Product design for complex workflows across FinTech, AI-native products, GovTech, and enterprise SaaS.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Quadri Ismail — Product Designer for Complex Products",
		description: "Product design for complex workflows across FinTech, AI-native products, GovTech, and enterprise SaaS.",
	},
	 alternates: { canonical: "/" },
	robots: { index: true, follow: true },
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
