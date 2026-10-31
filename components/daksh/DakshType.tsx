import type { CSSProperties, ReactNode } from "react";
import { Gilda_Display, Gochi_Hand, Manjari } from "next/font/google";

// The Daksh and Trailblaze pages use their own type: Gilda Display for
// headings, Manjari for text and Gochi Hand for the handwritten accents.
const gilda = Gilda_Display({ variable: "--nf-gilda", subsets: ["latin"], weight: "400" });
const manjari = Manjari({ variable: "--nf-manjari", subsets: ["latin"], weight: ["400", "700"] });
const hand = Gochi_Hand({ variable: "--nf-hand", subsets: ["latin"], weight: "400" });

// The theme's --font-* point at these --nf-* variables, but a custom property
// resolves where it's declared (:root), where they don't exist yet. Re-declare
// them on the element that carries the font classes (as app/preview does).
const fontVars = {
  "--font-gilda": 'var(--nf-gilda), Georgia, serif',
  "--font-manjari": 'var(--nf-manjari), "Segoe UI", sans-serif',
  "--font-hand": 'var(--nf-hand), "Comic Sans MS", cursive',
} as CSSProperties;

export default function DakshType({ children }: { children: ReactNode }) {
  return (
    <div className={`${gilda.variable} ${manjari.variable} ${hand.variable} font-manjari`} style={fontVars}>
      {children}
    </div>
  );
}
