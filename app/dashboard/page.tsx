import type { Metadata, Viewport } from "next";
import DakshType from "@/components/daksh/DakshType";
import DashboardLoader from "@/components/footfall/DashboardLoader";

// Organisers' live dashboard for Daksh & Open Day 2026 (director, coordinators, admin).
// Sign-in uses the DASHBOARD row of the Stalls sheet: one code + PIN, up to 6 devices.
export const metadata: Metadata = {
  title: "Live Dashboard | Daksh & Open Day 2026",
  description: "Live registrations, gate entries and stall footfall for Daksh & Open Day 2026 organisers.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

export default function DashboardPage() {
  return (
    <DakshType>
      <DashboardLoader />
    </DakshType>
  );
}
