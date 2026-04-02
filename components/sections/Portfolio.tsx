"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { EventItem } from "@/lib/content";

type FilterType = "All" | "Club Nights" | "Private" | "Brand Events";

const filters: FilterType[] = ["All", "Club Nights", "Private", "Brand Events"];

export default function Portfolio({ events }: { events: EventItem[] }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filtered = activeFilter === "All"
    ? events
    : events.filter((e) => e.type === activeFilter);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 bg-[#0A0A0A] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase mb-4"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Portfolio
            </motion.p>
            <div className="overflow-hidden pt-2">
              <motion.h2
                initial={{ y: "100%", opacity: 0 }}
                animate={inView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-playfair font-bold italic text-6xl md:text-7xl lg:text-8xl leading-tight text-white"
              >
                Past Events
              </motion.h2>
            </div>
          </div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                  activeFilter === f
                    ? "border-white bg-white text-[#0A0A0A]"
                    : "border-white/20 text-white/40 hover:border-white/50 hover:text-white/70"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group relative overflow-hidden break-inside-avoid"
              >
                <div className={`relative overflow-hidden ${event.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <Image
                    src={event.img}
                    alt={event.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Dark overlay always */}
                  <div className="absolute inset-0 bg-[#0A0A0A]/30 group-hover:bg-[#0A0A0A]/50 transition-colors duration-500" />
                  {/* Info overlay on hover */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <p
                      className="font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase mb-1"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {event.city} — {event.year}
                    </p>
                    <h3 className="font-playfair font-bold italic text-2xl text-white leading-tight">
                      {event.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
