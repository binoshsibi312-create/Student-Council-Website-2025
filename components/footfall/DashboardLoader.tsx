"use client";

import dynamic from "next/dynamic";

// Reads the saved sign-in from this device as it starts, so it renders in the browser only.
const Dashboard = dynamic(() => import("@/components/footfall/Dashboard"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-paper" aria-busy="true" />,
});

export default function DashboardLoader() {
  return <Dashboard />;
}
