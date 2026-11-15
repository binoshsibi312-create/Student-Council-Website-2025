"use client";

import dynamic from "next/dynamic";

// The scanner reads phone storage (session, unsent scans) as it starts, so it
// renders in the browser only.
const Scanner = dynamic(() => import("@/components/footfall/Scanner"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-paper" aria-busy="true" />,
});

export default function ScannerLoader() {
  return <Scanner />;
}
