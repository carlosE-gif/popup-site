"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "PopUp approached our brand event with a level of craft I've never seen from an event group before. Every single detail was intentional.",
    name: "Nour Khalil",
    role: "Marketing Director, Maison Blanc",
  },
  {
    quote:
      "From venue to lineup to the energy in the room — they executed everything without a single misstep. The night sold out in 48 hours.",
    name: "Tarek Saad",
    role: "Co-Founder, Frequency Club",
  },
  {
    quote:
      "Sharp nights. That's the only way to put it. PopUp doesn't do average — they do memorable.",
    name: "Lara Moussa",
    role: "Private Client",
  },
  {
    quote:
      "The way they integrated our product into the night felt completely organic. The audience didn't feel sold to — they felt invited.",
    name: "Sami Haddad",
    role: "Brand Manager, Arak & Co.",
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () =>
    setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] tracking-[0.25em] text-[#888888] uppercase mb-16"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          They Were There
        </motion.p>

        {/* Quote area */}
        <div className="relative min-h-[320px] md:min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Open quote mark */}
              <span className="font-playfair text-[8rem] leading-none text-[#0A0A0A]/08 select-none block -mb-10 -ml-2">
                &ldquo;
              </span>

              <blockquote className="font-playfair font-bold italic text-3xl md:text-4xl lg:text-5xl leading-[1.2] text-[#0A0A0A] max-w-4xl">
                {testimonials[current].quote}
              </blockquote>

              <div className="mt-10 flex items-center gap-4">
                <span className="block w-8 h-px bg-[#0A0A0A]/30" />
                <div>
                  <p className="font-sans text-sm font-medium text-[#0A0A0A]">
                    {testimonials[current].name}
                  </p>
                  <p
                    className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase mt-0.5"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 ${
                  i === current
                    ? "w-8 h-px bg-[#0A0A0A]"
                    : "w-2 h-px bg-[#0A0A0A]/20 hover:bg-[#0A0A0A]/50"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="group w-12 h-12 border border-[#0A0A0A]/15 flex items-center justify-center hover:border-[#0A0A0A] hover:bg-[#0A0A0A] transition-all duration-300"
              aria-label="Previous"
            >
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                className="group-hover:stroke-white transition-colors duration-300"
              >
                <path
                  d="M15 5H1M5 1L1 5L5 9"
                  stroke="#0A0A0A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-white transition-colors duration-300"
                />
              </svg>
            </button>
            <button
              onClick={next}
              className="group w-12 h-12 border border-[#0A0A0A]/15 flex items-center justify-center hover:border-[#0A0A0A] hover:bg-[#0A0A0A] transition-all duration-300"
              aria-label="Next"
            >
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
              >
                <path
                  d="M1 5H15M11 1L15 5L11 9"
                  stroke="#0A0A0A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-white transition-colors duration-300"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
