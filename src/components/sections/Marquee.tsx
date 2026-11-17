"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { marquee } from "@/content/home";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";

function Row({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) {
  const items = [...marquee, ...marquee];
  return (
    <div className={`flex overflow-hidden ${className}`}>
      <div
        className="marquee-track flex shrink-0 items-center gap-10 pr-10"
        style={{ animation: `${reverse ? "marquee-r" : "marquee-l"} 28s linear infinite` }}
      >
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl font-light tracking-tight whitespace-nowrap md:text-5xl">
            {m}
            <Plus className="h-5 w-5 text-mint" aria-hidden />
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="marquee-track flex shrink-0 items-center gap-10 pr-10"
        style={{ animation: `${reverse ? "marquee-r" : "marquee-l"} 28s linear infinite` }}
      >
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl font-light tracking-tight whitespace-nowrap md:text-5xl">
            {m}
            <Plus className="h-5 w-5 text-mint" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Scroll velocity nudges playback speed.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !lenis) return;
      const tracks = root.current?.querySelectorAll<HTMLElement>(".marquee-track");
      if (!tracks) return;
      const onScroll = ({ velocity }: { velocity: number }) => {
        const rate = gsap.utils.clamp(0.4, 3.2, 1 + Math.abs(velocity) * 0.08);
        tracks.forEach((t) => t.getAnimations().forEach((a) => { a.playbackRate = rate; }));
      };
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    },
    { scope: root, dependencies: [lenis] },
  );

  return (
    <div ref={root} aria-hidden className="relative z-[3] -mt-px overflow-hidden border-y border-white/10 bg-ink py-7 text-paper/90 motion-reduce:[&_.marquee-track]:!animate-none">
      <Row />
      <Row reverse className="mt-5 opacity-45" />
    </div>
  );
}
