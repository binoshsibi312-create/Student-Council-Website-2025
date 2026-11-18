import type { Metadata } from "next";
import Shell from "@/components/Shell";
import DakshType from "@/components/daksh/DakshType";
import { Sparkle } from "@/components/daksh/kit";
import { DakshLogo } from "@/components/daksh/ui";
import RegisterLoader from "@/components/register/RegisterLoader";
import { DAKSH } from "@/lib/daksh";

// Registration for Daksh & Open Day 2026. The forms post to the same Google
// Apps Script web app as before (tickets, emails and the sheet are unchanged).
export const metadata: Metadata = {
  title: "Register | Daksh & Open Day 2026",
  description: `Register for Daksh & Open Day 2026, ${DAKSH.dates} at CHRIST (Deemed to be University), ${DAKSH.venue} — get your QR ticket instantly.`,
};

export default function RegisterPage() {
  return (
    <Shell>
      <DakshType>
        <div className="flex flex-col gap-10 max-[640px]:gap-7">
          <section className="relative isolate overflow-hidden rounded-[16px] border border-line bg-card px-12 pt-12 pb-10 max-[1080px]:px-9 max-[640px]:px-5 max-[640px]:pt-8 max-[640px]:pb-7">
            <Sparkle className="absolute top-10 right-12 h-[30px] w-[30px] text-gold-light max-[640px]:top-6 max-[640px]:right-6 max-[640px]:h-5 max-[640px]:w-5" />
            <Sparkle className="absolute top-[92px] right-[98px] h-[16px] w-[16px] text-white/70 max-[640px]:hidden" />
            <p className="flex items-center gap-3.5 text-[15px] font-bold uppercase leading-[1.2] tracking-[0.22em] text-fg max-[640px]:gap-2.5 max-[640px]:text-[11px] max-[640px]:tracking-[0.18em]">
              <span className="h-0.5 w-10 shrink-0 bg-gold-light max-[640px]:w-6" aria-hidden="true" />
              University Student Council presents
            </p>
            <h1 className="mt-4 flex flex-col gap-2 max-[640px]:mt-3 max-[640px]:gap-1">
              <DakshLogo light className="w-[260px] max-[1080px]:w-[230px] max-[640px]:w-[150px]" />
              <span className="font-gilda text-[38px] uppercase leading-none text-fg max-[1080px]:text-[34px] max-[640px]:text-[23px]">
                &amp; Open Day <span className="text-gold-light">2026</span> — Registration
              </span>
            </h1>
            <p className="mt-5 text-[1.05rem] leading-[1.6] text-text-secondary max-[640px]:text-[0.98rem]">
              {DAKSH.dates} · {DAKSH.hours} · CHRIST (Deemed to be University), {DAKSH.venue}
            </p>
          </section>
          <RegisterLoader />
        </div>
      </DakshType>
    </Shell>
  );
}
