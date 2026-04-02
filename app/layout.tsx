import type { Metadata } from "next";
import { Playfair_Display, Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PopUp — The Art Behind The Night",
  description:
    "PopUp is the intervener group behind the region's most precise, unforgettable club nights, private parties, and brand events.",
  openGraph: {
    title: "PopUp — The Art Behind The Night",
    description:
      "PopUp is the intervener group behind the region's most precise, unforgettable club nights, private parties, and brand events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${spaceMono.variable} ${dmSans.variable} scroll-smooth`}
    >
      <body className="bg-white text-[#0A0A0A] font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
