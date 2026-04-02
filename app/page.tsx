import { unstable_noStore as noStore } from 'next/cache'
import { getContent } from '@/lib/content'
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  noStore()
  const content = getContent()

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero content={content.hero} />
        <About content={content.about} />
        <Services services={content.services} />
        <Portfolio events={content.portfolio} />
        <Testimonials testimonials={content.testimonials} />
        <Contact content={content.contact} />
      </main>
      <footer className="bg-[#0A0A0A] border-t border-white/[0.06] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="/logo.png"
            alt="PopUp"
            className="h-10 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="text-[10px] tracking-[0.2em] text-white/25 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
            © {new Date().getFullYear()} PopUp Events. All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.15em] text-white/20 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
            The Art Behind The Night
          </p>
        </div>
      </footer>
    </>
  );
}
