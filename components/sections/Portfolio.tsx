"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { EventItem } from "@/lib/content";

const ALL = "All";

// Grey until hover on desktop; touch screens get colour and details via .event-card in globals.css
function EventCard({ event }: { event: EventItem }) {
  const card = (
    <div className={`relative overflow-hidden ${event.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
      <Image
        src={event.img}
        alt={event.name}
        fill
        className="event-photo object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-[#0A0A0A]/30 group-hover:bg-[#0A0A0A]/50 transition-colors duration-500" />
      <div className="event-info absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/20 to-transparent translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
        <p
          className="font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase mb-1"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {event.city} — {event.year}
        </p>
        <h3 className="font-playfair font-bold italic text-2xl text-white leading-tight">
          {event.name}
          {event.link && <span aria-hidden="true" className="ml-2 not-italic text-base text-white/60">↗</span>}
        </h3>
        {event.desc && <p className="mt-2 text-xs text-white/60">{event.desc}</p>}
      </div>
    </div>
  );

  return event.link ? (
    <a href={event.link} target="_blank" rel="noopener noreferrer" aria-label={`${event.name}, open event page in a new tab`}>
      {card}
    </a>
  ) : (
    card
  );
}

export default function Portfolio({ events }: { events: EventItem[] }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState(ALL);

  // Tabs come from the events' cities, busiest first
  const counts = events.reduce<Record<string, number>>(
    (acc, e) => ({ ...acc, [e.city]: (acc[e.city] ?? 0) + 1 }),
    {}
  );
  const filters = [ALL, ...Object.keys(counts).sort((a, b) => counts[b] - counts[a])];
  const countFor = (f: string) => (f === ALL ? events.length : counts[f]);

  const filtered = activeFilter === ALL
    ? events
    : events.filter((e) => e.city === activeFilter);

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
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair font-bold italic text-6xl md:text-7xl lg:text-8xl leading-tight text-white"
            >
              Past Events
            </motion.h2>
          </div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-x-8 gap-y-3 border-b border-white/10"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
                className={`relative pb-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                  activeFilter === f ? "text-white" : "text-white/35 hover:text-white/70"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {f}
                <sup className="ml-1 text-[8px] tracking-normal text-white/40">{countFor(f)}</sup>
                {activeFilter === f && (
                  <motion.span
                    layoutId="portfolio-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-px bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
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
                className="event-card group relative overflow-hidden break-inside-avoid"
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
