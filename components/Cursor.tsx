"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TRAIL_LENGTH = 12;

interface TrailDot {
  x: number;
  y: number;
}

export default function Cursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [onDark, setOnDark] = useState(false);

  // Trail positions stored in a ref to avoid re-renders on every frame
  const trailRef = useRef<TrailDot[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -200, y: -200 }))
  );
  const mouseRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number | null>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  const animate = useCallback(() => {
    const trail = trailRef.current;
    const mouse = mouseRef.current;

    // First dot chases the real mouse
    trail[0] = {
      x: trail[0].x + (mouse.x - trail[0].x) * 0.45,
      y: trail[0].y + (mouse.y - trail[0].y) * 0.45,
    };

    // Each subsequent dot chases the one before it (slower = more lag)
    for (let i = 1; i < TRAIL_LENGTH; i++) {
      const ease = 0.38 - i * 0.02;
      trail[i] = {
        x: trail[i].x + (trail[i - 1].x - trail[i].x) * ease,
        y: trail[i].y + (trail[i - 1].y - trail[i].y) * ease,
      };
    }

    // Write directly to DOM nodes — no React re-renders
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      dot.style.transform = `translate(${trail[i].x}px, ${trail[i].y}px) translate(-50%, -50%)`;
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Detect dark/light section
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (el) {
        let node: HTMLElement | null = el;
        while (node && node !== document.body) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            const match = bg.match(/\d+/g);
            if (match) {
              const [r, g, b] = match.map(Number);
              setOnDark((r * 299 + g * 587 + b * 114) / 1000 < 80);
            }
            break;
          }
          node = node.parentElement;
        }
      }

      // Detect hoverable elements
      const target = e.target as HTMLElement;
      setHovering(
        !!(
          target.closest("a") ||
          target.closest("button") ||
          target.closest("[role='button']") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select")
        )
      );
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", () => setVisible(true));
    document.addEventListener("mouseleave", () => setVisible(false));

    return () => {
      document.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
        // i=0 is the head (largest, most opaque), i=TRAIL_LENGTH-1 is the tail (smallest, faintest)
        const progress = i / (TRAIL_LENGTH - 1); // 0 → head, 1 → tail
        const baseSize = hovering ? 10 : 6;
        const size = baseSize * (1 - progress * 0.75);
        const opacity = visible ? (1 - progress) * (hovering ? 0.6 : 0.85) : 0;
        const color = onDark ? "#FFFFFF" : "#0A0A0A";

        return (
          <div
            key={i}
            ref={(el) => { dotsRef.current[i] = el; }}
            className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full will-change-transform"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              opacity,
              transition: "opacity 0.3s ease, background-color 0.3s ease, width 0.2s ease, height 0.2s ease",
            }}
          />
        );
      })}
    </>
  );
}
