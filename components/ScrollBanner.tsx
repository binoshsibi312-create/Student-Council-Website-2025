"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollBanner() {
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const bannerOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);
  const bannerPointer = useTransform(bannerOpacity, (v) => (v > 0.5 ? "auto" : "none"));
  const introPointer = useTransform(introOpacity, (v) => (v > 0.5 ? "auto" : "none"));

  // Opening image (official USC photo) crossfades into the group photo
  // partway through the scroll — completes before the "Who We Are" text
  // phase takes over, so that text always reads against the group photo.
  const groupPhotoOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);

  return (
    <section className="scroll-banner-wrap" ref={wrapRef}>
      <div className="scroll-banner-sticky">
        <img
          src="/images/campus/usc-official.jpg"
          alt="University Student Council official photograph"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 38%" }}
        />
        <motion.img
          src="/images/campus/usc-group.jpg"
          alt="University Student Council members and mentors on the steps of the Central Block"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 46%", opacity: groupPhotoOpacity }}
        />

        {/* State 1: full banner overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col"
          style={{
            opacity: bannerOpacity,
            pointerEvents: bannerPointer,
            background:
              "linear-gradient(180deg, rgba(9,9,10,0.48) 0%, rgba(9,9,10,0.3) 35%, rgba(9,9,10,0.48) 65%, rgba(9,9,10,0.82) 100%)",
          }}
        >
          <div
            className="text-center pt-[clamp(28px,5vh,56px)] text-[0.8rem] font-semibold tracking-[0.28em] text-gold-light"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}
          >
            2026 – 2027
          </div>
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <h1
              className="font-display text-[clamp(1.7rem,3.6vw,3rem)] font-medium italic text-white tracking-[-0.01em] leading-[1.2] max-w-[800px]"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}
            >
              Bridging Students <em className="text-gold-light not-italic">&amp; the University.</em>
            </h1>
          </div>
          <div className="banner-wordmark-text text-center pb-[clamp(18px,4vh,48px)] overflow-hidden px-[5px]">
            University Student Council
          </div>
        </motion.div>

        {/* State 3: intro text overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-end px-[7vw] max-[640px]:justify-center max-[640px]:px-6"
          style={{
            opacity: introOpacity,
            pointerEvents: introPointer,
            background:
              "linear-gradient(100deg, rgba(9,9,10,0.12) 0%, rgba(9,9,10,0.58) 42%, rgba(9,9,10,0.9) 100%)",
          }}
        >
          <div className="max-w-[520px] text-left max-[640px]:max-w-full max-[640px]:text-center">
            <div className="text-[0.74rem] font-semibold tracking-[0.2em] uppercase text-gold-light mb-3">
              Who We Are
            </div>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.2rem)] font-semibold text-white mb-4.5 tracking-[-0.01em] leading-[1.15]">
              University Student Council
            </h2>
            <p className="text-base text-white/82 leading-[1.75] font-light mb-7 max-[640px]:mx-auto">
              The University Student Council exists to enhance the overall graduate experience at
              CHRIST (Deemed to be University) by promoting the general welfare of the student body —
              providing constructive feedback on campus life, championing student placements, guarding
              against ragging, and keeping the Christite spirit alive through arts, culture and service.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#about-section"
                className="inline-block bg-gold text-ink no-underline font-semibold text-[0.86rem] py-3 px-6 rounded-md transition-colors hover:bg-gold-light"
              >
                Learn More
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
