"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Splash({ children }: { children: ReactNode }) {
  const [lineIn, setLineIn] = useState(false);
  const [logoIn, setLogoIn] = useState(false);
  const [text1In, setText1In] = useState(false);
  const [text2In, setText2In] = useState(false);
  const [done, setDone] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    at(() => setLineIn(true), 300);
    at(() => {
      setLogoIn(true);
      setText1In(true);
    }, 750);
    at(() => setText1In(false), 2700);
    at(() => setText2In(true), 3150);
    at(() => setDone(true), 5300);

    timersRef.current = timers;
    return () => timers.forEach(clearTimeout);
  }, []);

  function skip() {
    timersRef.current.forEach(clearTimeout);
    setLineIn(true);
    setLogoIn(true);
    setText1In(false);
    setText2In(true);
    setDone(true);
  }

  const textBlockBase = "absolute left-8 top-1/2 flex flex-col items-start text-left pointer-events-none max-[640px]:left-4";

  return (
    <>
      <motion.div
        className="fixed inset-0 w-screen h-screen z-[9999] bg-ink flex justify-center items-center overflow-hidden"
        animate={{ opacity: done ? 0 : 1, scale: done ? 1.04 : 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ pointerEvents: done ? "none" : "auto" }}
        aria-label="University Student Council Splash"
      >
        <motion.div
          className="absolute w-[620px] h-[620px] top-1/2 left-1/2 rounded-full pointer-events-none z-[2] blur-[30px]"
          style={{
            background:
              "radial-gradient(circle, rgba(184,146,58,0.16) 0%, rgba(255,255,255,0.02) 55%, transparent 78%)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ scale: [0.9, 1.12], opacity: [0.65, 1] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[380px] h-[380px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[2] border border-gold/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[560px] h-[560px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[2] border border-white/8"
          animate={{ rotate: -360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        />

        <div className="splash-stage relative z-10">
          <div className="flex items-center min-w-0 justify-end pr-8 max-[640px]:pr-4">
            <motion.img
              src="/images/logos/christ_emblem.png"
              alt="CHRIST (Deemed to be University) Official Emblem"
              className="w-30 h-30 object-contain max-[640px]:w-20 max-[640px]:h-20"
              style={{ filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.55))" }}
              initial={{ opacity: 0, x: 70 }}
              animate={logoIn ? { opacity: 1, x: 0 } : { opacity: 0, x: 70 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </div>

          <motion.div
            className="splash-divider-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: lineIn ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />

          <div className="relative h-full pl-8 max-[640px]:pl-4">
            <motion.div
              className={textBlockBase}
              initial={{ opacity: 0, x: -56, y: "-50%" }}
              animate={text1In ? { opacity: 1, x: 0, y: "-50%" } : { opacity: 0, x: -56, y: "-50%" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="font-display font-semibold uppercase tracking-wide leading-[1.12] text-white text-[clamp(1.5rem,3.4vw,2.5rem)] max-[640px]:text-[clamp(1.1rem,6.5vw,1.6rem)]">
                Christ
              </span>
              <span className="font-display font-semibold uppercase tracking-wide leading-[1.12] text-gold-light text-[clamp(1.5rem,3.4vw,2.5rem)] max-[640px]:text-[clamp(1.1rem,6.5vw,1.6rem)]">
                University
              </span>
            </motion.div>

            <motion.div
              className={textBlockBase}
              initial={{ opacity: 0, x: -56, y: "-50%" }}
              animate={text2In ? { opacity: 1, x: 0, y: "-50%" } : { opacity: 0, x: -56, y: "-50%" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="font-display font-semibold uppercase tracking-wide leading-[1.12] text-white text-[clamp(1.3rem,2.9vw,2.15rem)] max-[640px]:text-[clamp(0.95rem,5.6vw,1.4rem)]">
                University
              </span>
              <span className="font-display font-semibold uppercase tracking-wide leading-[1.12] text-white text-[clamp(1.3rem,2.9vw,2.15rem)] max-[640px]:text-[clamp(0.95rem,5.6vw,1.4rem)]">
                Student
              </span>
              <span className="font-display font-semibold uppercase tracking-wide leading-[1.12] text-gold-light text-[clamp(1.3rem,2.9vw,2.15rem)] max-[640px]:text-[clamp(0.95rem,5.6vw,1.4rem)]">
                Council
              </span>
            </motion.div>
          </div>
        </div>

        <button
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] bg-transparent border-none text-white/55 text-[0.8rem] font-medium tracking-wide cursor-pointer py-2 px-4.5 flex items-center gap-2 transition-colors hover:text-white"
          onClick={skip}
        >
          <span>Skip Intro</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </motion.div>

      <motion.div
        className="relative w-full min-h-screen bg-paper text-ink"
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </>
  );
}
