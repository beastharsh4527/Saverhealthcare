"use client";

import { useRef } from "react";
import { philosophy } from "@/content/home";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Scroll-scrubbed word highlight: each word brightens from 20% → 100% as you scroll. */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create(".phi-quote", {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(self.words, { opacity: 0.16 }, {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 65%", scrub: true },
          }),
      });
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="grain relative overflow-hidden bg-ink py-28 text-paper md:py-44">
      <span aria-hidden className="pointer-events-none absolute -top-10 left-6 font-display text-[16rem] leading-none text-mint/10 select-none md:text-[26rem]">&ldquo;</span>
      <div className="container-x relative z-[2] grid gap-12">
        <span className="eyebrow text-mint">{philosophy.eyebrow}</span>
        <blockquote className="phi-quote max-w-5xl font-display text-3xl leading-[1.25] font-light md:text-5xl">
          {philosophy.quote}
        </blockquote>
        <div className="flex items-center gap-5">
          <span className="h-px w-14 bg-gold" aria-hidden />
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">{philosophy.name}</p>
            <p className="text-sm text-fog">{philosophy.meta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
