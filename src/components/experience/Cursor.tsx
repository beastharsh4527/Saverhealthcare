"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Dot + trailing ring. Desktop fine-pointer only. Elements can set data-cursor="View" | "Drag". */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable only after client capability check
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    let last = "";

    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role='button'], input, textarea, select, label");
      const next = labelled?.dataset.cursor ?? (interactive ? "•" : "");
      if (next !== last) {
        last = next;
        setLabel(next === "•" ? "" : next);
        gsap.to(ring.current, { scale: next ? (next === "•" ? 1.6 : 2.6) : 1, duration: 0.4, ease: "expo.out" });
        gsap.to(dot.current, { scale: next ? 0 : 1, duration: 0.3 });
      }
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[90] -mt-1 -ml-1 h-2 w-2 rounded-full bg-mint mix-blend-difference" />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[90] -mt-5 -ml-5 grid h-10 w-10 place-items-center rounded-full border border-mint/70 backdrop-blur-[1px]"
      >
        <span className="font-mono text-[5px] tracking-[0.2em] text-mint uppercase">{label}</span>
      </div>
    </>
  );
}
