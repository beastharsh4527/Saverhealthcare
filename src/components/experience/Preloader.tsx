"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * First-visit preloader. It is an overlay only: the page renders underneath
 * immediately (never gated), so LCP is not delayed. Total ≤ 1.5s.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("saver:intro") === "1";
      sessionStorage.setItem("saver:intro", "1");
    } catch {}
    if (seen || prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- dismiss immediately on repeat visits
      setShow(false);
      return;
    }
    const el = root.current!;
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setShow(false) });
    tl.fromTo(el.querySelector(".pl-path"), { strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0)
      .to(counter, { v: 100, duration: 0.95, ease: "power3.inOut", onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0"); } }, 0)
      .to(el.querySelector(".pl-inner"), { yPercent: -30, opacity: 0, duration: 0.35, ease: "power2.in" }, 0.95)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "expo.inOut" }, 1.0);
    return () => { tl.kill(); };
  }, []);

  if (!show) return null;
  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] grid place-items-center bg-ink text-paper"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="pl-inner flex flex-col items-center gap-6">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="34" stroke="currentColor" strokeOpacity=".12" strokeWidth="1" />
          <path
            className="pl-path"
            d="M36 54C22 45 15 37 15 28.5 15 22 20 17 26.2 17c4.3 0 7.6 2.4 9.8 5.8C38.2 19.4 41.5 17 45.8 17 52 17 57 22 57 28.5 57 37 50 45 36 54Z"
            stroke="var(--color-mint)"
            strokeWidth="2"
            strokeDasharray="260"
            strokeDashoffset="260"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex items-baseline gap-3 font-mono text-xs tracking-[0.3em] text-fog uppercase">
          <span>Saver Health Care</span>
          <span ref={count} className="text-paper tabular-nums">000</span>
        </div>
      </div>
    </div>
  );
}
