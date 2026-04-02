"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${scrolled
        ? "bg-[#0A0A0A] py-4 border-b border-white/10"
        : "bg-white/95 backdrop-blur-sm py-5 border-b border-[#0A0A0A]/06"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group relative"
        >
          <img
            src="/logo.png"
            alt="PopUp"
            className="h-12 w-auto transition-all duration-500"
            style={{
              filter: scrolled
                ? "brightness(0) invert(1)"
                : "brightness(0)",
            }}
          />
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleNavClick(link.href)}
                className={`font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 relative group ${scrolled
                  ? "text-white/60 hover:text-white"
                  : "text-[#888888] hover:text-[#0A0A0A]"
                  }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${scrolled ? "bg-white" : "bg-[#0A0A0A]"
                    }`}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick("#contact")}
            className={`hidden md:block font-mono text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-300 ${scrolled
              ? "border-white text-white hover:bg-white hover:text-[#0A0A0A]"
              : "border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white"
              }`}
          >
            Book PopUp
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className={`block w-6 h-px transition-colors duration-500 ${scrolled ? "bg-white" : "bg-[#0A0A0A]"
                }`}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`block w-6 h-px transition-colors duration-500 ${scrolled ? "bg-white" : "bg-[#0A0A0A]"
                }`}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className={`block w-6 h-px transition-colors duration-500 ${scrolled ? "bg-white" : "bg-[#0A0A0A]"
                }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`md:hidden overflow-hidden border-t ${scrolled
              ? "bg-[#0A0A0A] border-white/10"
              : "bg-white border-[#0A0A0A]/08"
              }`}
          >
            <ul className="flex flex-col px-6 py-10 gap-7">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className={`font-playfair text-4xl font-bold italic transition-colors duration-200 block w-full text-left ${scrolled
                      ? "text-white hover:text-white/70"
                      : "text-[#0A0A0A] hover:text-[#888888]"
                      }`}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.07 }}
              >
                <button
                  onClick={() => handleNavClick("#contact")}
                  className={`font-mono text-xs tracking-[0.2em] uppercase px-6 py-4 w-full transition-colors duration-300 ${scrolled
                    ? "bg-white text-[#0A0A0A] hover:bg-white/90"
                    : "bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                    }`}
                >
                  Book PopUp
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
