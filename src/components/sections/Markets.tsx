"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { markets, marketsIntro } from "@/content/clinical";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { img, cn } from "@/lib/utils";

/** Expanding flex panels — hover/focus grows a country to ~60%; stacked on mobile. */
export function Markets() {
  const [active, setActive] = useState(0);

  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div className="container-x grid gap-12">
        <SectionHeading tone="dark" eyebrow={marketsIntro.eyebrow} title={marketsIntro.title} sub={marketsIntro.sub} />

        <div className="flex flex-col gap-4 lg:h-[34rem] lg:flex-row">
          {markets.map((m, i) => {
            const isActive = active === i;
            return (
              <article
                key={m.slug}
                onMouseEnter={() => setActive(i)}
                onFocusCapture={() => setActive(i)}
                className={cn(
                  "relative overflow-hidden rounded-3xl border transition-all duration-700 ease-[var(--ease-in-out-quart)]",
                  isActive ? "border-mint/40 lg:flex-[2.6]" : "border-white/10 lg:flex-[1]",
                )}
              >
                <Image src={img(m.photo, 1100)} alt="" fill sizes="(min-width:1024px) 60vw, 92vw" className={cn("object-cover transition-opacity duration-700", isActive ? "opacity-30" : "opacity-12")} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" aria-hidden />

                <div className="relative z-[2] flex h-full min-h-[22rem] flex-col justify-between gap-8 p-7 md:p-9">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-display text-5xl font-light md:text-6xl">{m.code}</span>
                      <p className="mt-1 font-mono text-[0.65rem] tracking-[0.22em] text-fog uppercase">{m.country}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs text-mint">{m.n}</span>
                      <p className="chip mt-2 border-gold/50 text-gold">{m.badge}</p>
                    </div>
                  </div>

                  <div className={cn("grid gap-5 transition-opacity duration-500", isActive ? "opacity-100" : "lg:opacity-0")}>
                    <h3 className="font-display text-2xl md:text-3xl">{m.title}</h3>
                    <p className={cn("max-w-lg text-sm leading-relaxed text-fog", !isActive && "lg:hidden")}>{m.desc}</p>
                    <div className={cn("flex flex-wrap gap-x-10 gap-y-4", !isActive && "lg:hidden")}>
                      {m.stats.map((s) => (
                        <div key={s.label}>
                          <span className="font-display text-3xl text-mint md:text-4xl">
                            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                          </span>
                          <p className="font-mono text-[0.6rem] tracking-[0.18em] text-fog uppercase">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className={cn("flex flex-wrap items-center justify-between gap-4", !isActive && "lg:hidden")}>
                      <ul className="flex flex-wrap gap-2">
                        {m.tags.map((t) => <li key={t} className="chip text-paper/70">{t}</li>)}
                      </ul>
                      <Link href={`/markets/${m.slug}`} className="group flex items-center gap-2 text-sm font-medium text-mint" data-cursor="View">
                        <span className="link-underline">{m.cta}</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
