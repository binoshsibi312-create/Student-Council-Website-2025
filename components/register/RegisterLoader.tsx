"use client";

import dynamic from "next/dynamic";

// The registration forms read saved drafts and the page address as they start,
// so they render in the browser only.
const RegisterApp = dynamic(() => import("@/components/register/RegisterApp"), {
  ssr: false,
  loading: () => <div className="min-h-[420px] rounded-[16px] border border-line bg-card" aria-busy="true" />,
});

export default function RegisterLoader() {
  return <RegisterApp />;
}
