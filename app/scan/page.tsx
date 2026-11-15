import type { Metadata, Viewport } from "next";
import DakshType from "@/components/daksh/DakshType";
import ScannerLoader from "@/components/footfall/ScannerLoader";

// Volunteer footfall scanner for Daksh & Open Day 2026: stall/gate volunteers
// sign in with a stall code + PIN, scan visitors' ticket QRs with the live
// camera, and record entries, consent and feedback into the Daksh Google Sheet.
export const metadata: Metadata = {
  title: "Footfall Scanner | Daksh & Open Day 2026",
  description: "Volunteer scanner for Daksh & Open Day 2026 stalls and entry gates.",
  robots: { index: false, follow: false },
  manifest: "/scan-manifest.json",
  appleWebApp: { capable: true, title: "Daksh Scanner", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function ScanPage() {
  return (
    <DakshType>
      <ScannerLoader />
    </DakshType>
  );
}
