import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Gochi_Hand, Manjari } from "next/font/google";
import ShellB from "@/components/daksh-b/ShellB";

// Design B: an alternative Daksh / Trailblaze design built from the Daksh
// design board (General Sans, Manjari, a handwritten accent) and the Daksh
// 2026 brochure. Lives under /preview so it can be compared with the current
// design without touching it. The board's "Marykate" isn't freely available,
// so Gochi Hand stands in as the handwritten accent.
const generalSans = localFont({
  variable: "--nf-general-sans",
  src: [
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400" },
    { path: "../fonts/GeneralSans-Medium.woff2", weight: "500" },
    { path: "../fonts/GeneralSans-Semibold.woff2", weight: "600" },
    { path: "../fonts/GeneralSans-Bold.woff2", weight: "700" },
  ],
});
const manjari = Manjari({ variable: "--nf-manjari", subsets: ["latin"], weight: ["400", "700"] });
const hand = Gochi_Hand({ variable: "--nf-hand", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// The theme's --font-gs/--font-manjari/--font-hand point at these next/font
// variables, but a custom property is resolved where it's declared (:root),
// where the --nf-* variables don't exist yet. Re-declare them here, on the
// element that carries the font classes, so they resolve correctly.
const fontVars = {
  "--font-gs": 'var(--nf-general-sans), "Segoe UI", sans-serif',
  "--font-manjari": 'var(--nf-manjari), "Segoe UI", sans-serif',
  "--font-hand": 'var(--nf-hand), "Comic Sans MS", cursive',
} as CSSProperties;

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${generalSans.variable} ${manjari.variable} ${hand.variable}`} style={fontVars}>
      <ShellB>{children}</ShellB>
    </div>
  );
}
