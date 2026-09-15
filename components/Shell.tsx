import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start max-w-[1600px] mx-auto max-[1080px]:flex-col">
      <Sidebar />
      <main
        tabIndex={-1}
        className="content-col flex-1 mx-auto pt-14 pb-20 px-16 max-[1080px]:pt-10 max-[1080px]:pb-16 max-[1080px]:px-6 max-[640px]:pt-8 max-[640px]:pb-14 max-[640px]:px-4.5"
      >
        {children}
        <footer className="text-center mt-16 pt-8 border-t border-line">
          <div className="font-display text-base font-semibold text-ink mb-1.5">
            University Student Council — CHRIST (Deemed to be University)
          </div>
          <div className="text-[0.78rem] text-text-muted font-light">
            © 2026 CHRIST (Deemed to be University), Bangalore. A University Student Council Initiative.
          </div>
        </footer>
      </main>
    </div>
  );
}
