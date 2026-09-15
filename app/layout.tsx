import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Roboto, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import Splash from "@/components/Splash";
import PWARegister from "@/components/PWARegister";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "University Student Council | CHRIST (Deemed to be University)",
  description:
    "Official Portal of the University Student Council, CHRIST (Deemed to be University) — governance, mentors, members, campus map and procedural guidance for Christites.",
  icons: {
    icon: "/images/logos/christ_emblem.png",
    apple: "/images/logos/christ_emblem.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "USC CHRIST",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${roboto.variable} ${bodoniModa.variable}`}>
      <body>
        <PWARegister />
        <Splash>{children}</Splash>
      </body>
    </html>
  );
}
