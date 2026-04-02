"use client";

import { motion } from "framer-motion";
import type { HeroContent } from "@/lib/content";

const lineVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0.3 + i * 0.18,
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const fadeUp = (delay: number) => ({
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

export default function Hero({ content }: { content: HeroContent }) {
  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white">
      {/* Grain texture */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Pencil stroke SVG — draws itself across the page */}
      <div className="absolute inset-x-0 top-[45%] pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden="true"
        >
          <path
            d="M -10 20 C 200 8, 400 32, 600 18 C 800 4, 1000 28, 1200 16 C 1350 8, 1430 22, 1460 20"
            stroke="#0A0A0A"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.12"
            className="pencil-stroke"
          />
        </svg>
      </div>

      {/* Thin vertical grid lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[20, 50, 80].map((left) => (
          <div
            key={left}
            className="absolute top-0 bottom-0 w-px bg-[#0A0A0A]/[0.04]"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span
          className="font-mono text-[10px] tracking-[0.25em] text-[#888888]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-[#0A0A0A]/40 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-16 pt-36 pb-24 w-full">

        {/* Pre-label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="block w-6 h-px bg-[#0A0A0A]/40" />
          <span
            className="text-[10px] tracking-[0.25em] text-[#888888] uppercase"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Event Intervener Group
          </span>
        </motion.div>

        {/* Giant editorial headline */}
        <div className="mb-16">
          {content.lines.map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.h1
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="font-playfair font-bold italic text-[14vw] md:text-[11vw] lg:text-[10vw] leading-[0.9] tracking-[-0.02em] text-[#0A0A0A] select-none"
              >
                {line}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Descriptor + CTAs */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <motion.p
            {...fadeUp(1.0)}
            className="max-w-sm text-[#888888] font-sans text-sm leading-relaxed"
          >
            {content.descriptor}
          </motion.p>

          <motion.div {...fadeUp(1.15)} className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => scrollToSection("#portfolio")}
              className="group font-mono text-[11px] tracking-[0.18em] uppercase px-8 py-4 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-300 relative overflow-hidden"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {content.ctaWork}
            </button>
            <button
              onClick={() => scrollToSection("#contact")}
              className="font-mono text-[11px] tracking-[0.18em] uppercase px-8 py-4 bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/85 transition-colors duration-300"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {content.ctaBook}
            </button>
          </motion.div>
        </div>

        {/* Animated SVG pencil stroke line across full width */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="mt-20"
        >
          <svg
            viewBox="0 0 1200 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            aria-hidden="true"
          >
            <path
              d="M 0 8 C 150 3, 300 13, 450 7 C 600 2, 750 12, 900 6 C 1050 1, 1150 10, 1200 8"
              stroke="#0A0A0A"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.2"
              className="pencil-stroke"
            />
          </svg>
        </motion.div>

      </div>
    </section>
  );
}
