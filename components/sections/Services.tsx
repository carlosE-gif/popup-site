"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ServiceItem } from "@/lib/content";

export default function Services({ services }: { services: ServiceItem[] }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="font-mono text-[10px] tracking-[0.25em] text-[#888888] uppercase mb-4"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Services
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%", opacity: 0 }}
                animate={inView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-playfair font-bold italic text-6xl md:text-7xl lg:text-8xl leading-none text-[#0A0A0A]"
              >
                What We Do
              </motion.h2>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-xs text-[#888888] font-sans text-sm leading-relaxed"
          >
            Six disciplines. One obsession: making every detail count.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#0A0A0A]/10">
          {services.map((service, i) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.1 + i * 0.08,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group relative border-b border-r border-[#0A0A0A]/10 p-8 cursor-default overflow-hidden"
            >
              {/* Hover fill */}
              <div className="absolute inset-0 bg-[#0A0A0A] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />

              <div className="relative z-10">
                <span
                  className="font-mono text-[11px] tracking-[0.2em] text-[#888888] group-hover:text-white/30 transition-colors duration-300 mb-6 block"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {service.num}
                </span>
                <h3 className="font-playfair font-bold text-xl leading-tight text-[#0A0A0A] group-hover:text-white transition-colors duration-300 mb-4">
                  {service.title}
                </h3>
                <p className="font-sans text-sm text-[#888888] group-hover:text-white/50 leading-relaxed transition-colors duration-300">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
