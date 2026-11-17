"use client";

import { Check, Mail, Phone } from "lucide-react";
import { useRef } from "react";
import { hero } from "@/content/home";
import { site, tel } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Globe } from "@/components/globe/Globe";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ delay: 0.15 });
      // Headline: transform-only masked reveal — paints immediately, LCP-safe.
      const split = SplitText.create(".hero-h1", {
        type: "lines,words",
        linesClass: "split-line",
        wordsClass: "split-word",
        autoSplit: true,
        onSplit: (self) => tl.from(self.words, { yPercent: 112, rotate: 2.5, duration: 1.4, stagger: 0.05, ease: "expo.out" }, 0),
      });
      tl.from(".hero-stagger", { y: 36, autoAlpha: 0, duration: 1.1, stagger: 0.09, ease: "expo.out" }, 0.35)
        .from(".hero-visual", { clipPath: "inset(12% 12% 12% 12% round 32px)", autoAlpha: 0, duration: 1.5, ease: "expo.inOut" }, 0.2)
        .from(".hero-sticker", { scale: 0, rotate: -120, duration: 1.2, ease: "elastic.out(1, 0.5)" }, 1.0);
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="grain relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute -top-48 -left-32 h-[42rem] w-[42rem] rounded-full bg-brand/25 blur-[160px]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-gold/10 blur-[140px]" />

      <div className="container-x relative z-[2] grid min-h-svh content-end gap-12 pt-40 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-6 lg:pt-36">
        <div className="grid max-w-2xl content-center gap-7">
          <div className="hero-stagger flex items-center gap-3 self-start rounded-full border border-white/12 bg-white/[0.04] py-2 pr-5 pl-3 backdrop-blur">
            <span className="pulse-dot h-2 w-2 rounded-full bg-mint" aria-hidden />
            <span className="font-mono text-[0.68rem] tracking-[0.2em] text-fog uppercase">{hero.pill.label}</span>
            <span className="text-sm text-paper"><em className="font-display text-mint not-italic">{hero.pill.value}</em> {hero.pill.text}</span>
          </div>

          <span className="hero-stagger eyebrow text-mint">{hero.eyebrow}</span>

          <h1 className="hero-h1 display-xl">
            {hero.title.before} <em className="text-mint">{hero.title.em}</em> {hero.title.after}
          </h1>

          <p className="hero-stagger max-w-xl text-lg leading-relaxed text-fog">{hero.lede}</p>

          <div className="hero-stagger flex flex-wrap items-center gap-4">
            <ButtonLink href={hero.primary.href} variant="primary" size="lg">{hero.primary.label}</ButtonLink>
            <ButtonLink href={hero.secondary.href} variant="ghost-light" size="lg">{hero.secondary.label}</ButtonLink>
          </div>

          <ul className="hero-stagger grid gap-2.5 pt-2 sm:grid-cols-1">
            {hero.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[0.95rem] text-paper/85">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/30 text-mint"><Check className="h-3 w-3" aria-hidden /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="hero-visual relative aspect-square max-h-[560px] w-full overflow-hidden rounded-[32px] border border-white/10 bg-ink-2/60">
            <Globe />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[inset_0_0_120px_rgba(7,16,11,0.9)]" />
          </div>

          <div className="hero-sticker absolute -top-6 -right-2 grid h-28 w-28 place-items-center md:-right-6">
            <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full text-gold" aria-hidden>
              <defs><path id="circ" d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" /></defs>
              <text className="font-mono fill-current text-[9.5px] tracking-[0.18em] uppercase">
                <textPath href="#circ">{hero.sticker.top} · {hero.sticker.bottom} · </textPath>
              </text>
            </svg>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold font-display text-lg text-ink">S</span>
          </div>

          <div className="hero-stagger absolute right-4 -bottom-6 left-4 grid gap-3 rounded-2xl border border-white/10 bg-ink-2/90 p-5 backdrop-blur-xl md:-bottom-8 md:left-auto md:w-[21rem]">
            <span className="font-mono text-[0.65rem] tracking-[0.22em] text-mint uppercase">{hero.card.tag}</span>
            <p className="font-display text-xl leading-snug">{hero.card.title}</p>
            <div className="grid gap-2 text-sm">
              <a href={tel(site.phoneUk)} className="flex items-center justify-between gap-2 text-paper/85 hover:text-mint">
                <span className="flex items-center gap-2 text-fog"><Phone className="h-3.5 w-3.5" aria-hidden />{hero.card.ukLabel}</span>
                {site.phoneUk}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center justify-between gap-2 text-paper/85 hover:text-mint">
                <span className="flex items-center gap-2 text-fog"><Mail className="h-3.5 w-3.5" aria-hidden />{hero.card.emailLabel}</span>
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
