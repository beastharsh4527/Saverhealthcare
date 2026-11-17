"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { specialties, specialtiesIntro } from "@/content/clinical";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/utils";

/** Bento grid with cursor-follow glow; the spotlight tile swaps to whichever specialty is selected. */
export function Specialties() {
  const [idx, setIdx] = useState(0);
  const spot = specialties[idx];
  const gridRef = useRef<HTMLUListElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const t = (e.currentTarget as HTMLElement);
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", `${e.clientX - r.left}px`);
    t.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-x grid gap-12">
        <SectionHeading eyebrow={specialtiesIntro.eyebrow} title={specialtiesIntro.title} sub={specialtiesIntro.sub} />

        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Spotlight tile */}
          <div className="relative min-h-[26rem] overflow-hidden rounded-3xl bg-ink text-paper">
            <AnimatePresence mode="wait">
              <motion.div
                key={spot.name}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={img(spot.photo, 1100)} alt="" fill sizes="(min-width:1024px) 46vw, 92vw" className="object-cover opacity-45" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
              </motion.div>
            </AnimatePresence>
            <div className="relative z-[2] flex h-full flex-col justify-between gap-10 p-8 md:p-10">
              <span className="eyebrow text-mint">{specialtiesIntro.spotlightLabel}</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={spot.name}
                  className="grid gap-5"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="font-display text-4xl md:text-5xl">{spot.name}</h3>
                  <p className="max-w-md leading-relaxed text-paper/80">{spot.bio}</p>
                  <div className="flex flex-wrap gap-x-12 gap-y-4 pt-2">
                    <div>
                      <span className="font-display text-5xl text-mint">{spot.openings}</span>
                      <p className="font-mono text-[0.62rem] tracking-[0.2em] text-fog uppercase">{specialtiesIntro.openingsLabel}</p>
                    </div>
                    <div>
                      <span className="font-display text-2xl">{spot.markets}</span>
                      <p className="font-mono text-[0.62rem] tracking-[0.2em] text-fog uppercase">{specialtiesIntro.marketsLabel}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Tile grid */}
          <Reveal as="ul" selector="li" stagger={0.05} className="grid grid-cols-2 gap-3 sm:grid-cols-2" y={26}>
            {specialties.map((s, i) => (
              <li key={s.label} ref={i === 0 ? undefined : undefined}>
                <button
                  type="button"
                  onClick={() => setIdx(i)}
                  onMouseEnter={() => setIdx(i)}
                  onMouseMove={onMove}
                  aria-pressed={idx === i}
                  className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-300 ${
                    idx === i ? "border-brand bg-ink text-paper" : "border-ink/10 bg-paper hover:border-brand/50"
                  }`}
                  style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "radial-gradient(180px circle at var(--mx) var(--my), color-mix(in oklab, var(--color-mint) 16%, transparent), transparent 70%)" }}
                  />
                  <span className="relative flex items-center justify-between gap-2">
                    <span className="text-sm font-medium md:text-[0.95rem]">{s.label}</span>
                    <span className={`font-display text-2xl ${idx === i ? "text-mint" : "text-brand"}`}>
                      <Counter value={s.openings} separator={false} />
                    </span>
                  </span>
                </button>
              </li>
            ))}
            <span ref={gridRef as never} className="hidden" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
