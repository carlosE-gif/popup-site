"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

function Counter({ to, suffix }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] });
    }
  }, [inView, count, to]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  {
    to: 150,
    suffix: "+",
    label: "Events Produced",
    desc: "Club nights, private gatherings, and brand activations across the region.",
  },
  {
    to: 60,
    suffix: "+",
    label: "Venues Partnered",
    desc: "From underground rooms to rooftop terraces — every space, precisely chosen.",
  },
  {
    to: 20,
    suffix: "K+",
    label: "Guests",
    desc: "Thousands of nights, one consistent promise: you will remember this.",
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16 bg-[#0A0A0A] overflow-hidden"
    >
      {/* White rule top */}
      <div className="max-w-7xl mx-auto">
        <div className="border-t border-white/[0.08] mb-20 pt-0" />
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-start">
        {/* Left: label + text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 0 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase mb-10"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            About
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-playfair font-bold italic text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-white mb-10"
          >
            Precision.
            <br />
            Craft.
            <br />
            Execution.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
            className="space-y-5 text-white/50 font-sans text-sm leading-relaxed"
          >
            <p>
              PopUp isn&apos;t an agency. We&apos;re the interveners — the
              team that steps in and transforms a space into an experience.
              We begin with intention and end with something unforgettable.
            </p>
            <p>
              From intimate private parties to large-scale brand activations,
              we bring precision to every detail: concept, crowd, culture,
              and craft. Our network spans the region&apos;s most exclusive
              venues, artists, and brands.
            </p>
            <p className="text-white font-medium">
              Sharp nights. Perfect execution.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-10 flex items-center gap-4"
          >
            <span className="block w-8 h-px bg-white/30" />
            <span
              className="text-[10px] tracking-[0.25em] text-white/30 uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Est. 2020
            </span>
          </motion.div>
        </div>

        {/* Right: stat counters */}
        <div className="flex flex-col divide-y divide-white/[0.08]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group py-10 first:pt-0 last:pb-0"
            >
              <div className="font-playfair font-bold italic text-[4.5rem] md:text-[5.5rem] text-white leading-none tracking-tight group-hover:opacity-70 transition-opacity duration-400">
                <Counter to={stat.to} suffix={stat.suffix} />
              </div>
              <div
                className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mt-2 mb-3"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {stat.label}
              </div>
              <p className="font-sans text-xs text-white/25 leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* White rule bottom */}
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-white/[0.08] mt-20" />
      </div>
    </section>
  );
}
