"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function Contact() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [formData, setFormData] = useState({
    name: "",
    eventType: "",
    date: "",
    budget: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 bg-[#0A0A0A] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase mb-6"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Book PopUp
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              animate={inView ? { y: "0%", opacity: 1 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair font-bold italic text-5xl md:text-6xl lg:text-7xl leading-[1.0] text-white max-w-3xl"
            >
              Let&apos;s Draw Something Together
            </motion.h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="bg-transparent border-b border-white/15 py-3 text-white text-sm font-sans placeholder:text-white/20 focus:border-white focus:outline-none transition-colors duration-200"
              />
            </div>

            {/* Event Type */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="eventType"
                className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="bg-transparent border-b border-white/15 py-3 text-sm font-sans focus:border-white focus:outline-none transition-colors duration-200 appearance-none cursor-pointer text-white/70"
                style={{ color: formData.eventType ? "white" : "rgba(255,255,255,0.3)" }}
              >
                <option value="" disabled className="bg-[#0A0A0A] text-white/40">
                  Select event type
                </option>
                <option value="Club Night" className="bg-[#0A0A0A] text-white">Club Night</option>
                <option value="Private Party" className="bg-[#0A0A0A] text-white">Private Party</option>
                <option value="Brand Activation" className="bg-[#0A0A0A] text-white">Brand Activation</option>
                <option value="Corporate Event" className="bg-[#0A0A0A] text-white">Corporate Event</option>
                <option value="Other" className="bg-[#0A0A0A] text-white">Other</option>
              </select>
            </div>

            {/* Date + Budget row */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="date"
                  className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="text"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="MM / YYYY"
                  className="bg-transparent border-b border-white/15 py-3 text-white text-sm font-sans placeholder:text-white/20 focus:border-white focus:outline-none transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="budget"
                  className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white/15 py-3 text-sm font-sans focus:border-white focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                  style={{ color: formData.budget ? "white" : "rgba(255,255,255,0.3)" }}
                >
                  <option value="" disabled className="bg-[#0A0A0A] text-white/40">
                    Range
                  </option>
                  <option value="under-5k" className="bg-[#0A0A0A] text-white">Under $5K</option>
                  <option value="5k-15k" className="bg-[#0A0A0A] text-white">$5K – $15K</option>
                  <option value="15k-50k" className="bg-[#0A0A0A] text-white">$15K – $50K</option>
                  <option value="50k+" className="bg-[#0A0A0A] text-white">$50K+</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your event"
                rows={4}
                className="bg-transparent border-b border-white/15 py-3 text-white text-sm font-sans placeholder:text-white/20 focus:border-white focus:outline-none transition-colors duration-200 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group self-start font-mono text-[11px] tracking-[0.2em] uppercase px-10 py-4 bg-white text-[#0A0A0A] hover:bg-white/85 transition-all duration-300 mt-2"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Send It
            </button>
          </motion.form>

          {/* Right: contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col justify-between gap-16"
          >
            {/* Email */}
            <div>
              <p
                className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase mb-3"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Email
              </p>
              <a
                href="mailto:hello@popup.events"
                className="font-playfair font-bold italic text-2xl text-white hover:text-white/60 transition-colors duration-200"
              >
                hello@popup.events
              </a>
            </div>

            {/* Decorative rule */}
            <div className="w-full h-px bg-white/08" />

            {/* Socials */}
            <div>
              <p
                className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase mb-6"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                Find Us
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "IG", href: "#", full: "Instagram" },
                  { label: "TK", href: "#", full: "TikTok" },
                  { label: "WA", href: "#", full: "WhatsApp" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="group flex items-center gap-4"
                  >
                    <span
                      className="font-mono text-[11px] tracking-[0.15em] text-white/40 group-hover:text-white transition-colors duration-200 w-6"
                      style={{ fontFamily: "var(--font-space-mono)" }}
                    >
                      {social.label}
                    </span>
                    <span className="w-8 h-px bg-white/10 group-hover:w-12 group-hover:bg-white transition-all duration-300" />
                    <span className="font-sans text-sm text-white/40 group-hover:text-white transition-colors duration-200">
                      {social.full}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <p className="font-playfair italic text-xl text-white/20">
              &ldquo;Sharp Nights. Perfect Execution.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
