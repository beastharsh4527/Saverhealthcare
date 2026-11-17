"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { team, teamIntro } from "@/content/people";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { img, cn } from "@/lib/utils";

/** Featured panel + thumbnail switcher, clip-path photo reveal, 3D tilt on the photo. */
export function Team() {
  const [idx, setIdx] = useState(0);
  const m = team[idx];

  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
  };
  const untilt = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-x grid gap-14">
        <SectionHeading eyebrow={teamIntro.eyebrow} title={teamIntro.title} />

        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Photo */}
          <div onMouseMove={tilt} onMouseLeave={untilt} className="relative transition-transform duration-300 ease-out motion-reduce:!transform-none" style={{ transformStyle: "preserve-3d" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={m.id}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink"
                initial={{ clipPath: "circle(12% at 50% 50%)" }}
                animate={{ clipPath: "circle(120% at 50% 50%)" }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              >
                <Image src={img(m.photo, 900)} alt={`${m.first} ${m.last} — ${m.role}`} fill sizes="(min-width:1024px) 38vw, 90vw" className="object-cover" />
                <span className="absolute top-5 left-5 font-mono text-xs tracking-[0.2em] text-paper/90">{m.id}</span>
                <span className="absolute right-5 bottom-5 rounded-xl bg-ink/70 px-4 py-3 text-paper backdrop-blur">
                  <em className="font-display text-3xl not-italic">{m.years}</em>
                  <span className="ml-2 inline-block font-mono text-[0.58rem] leading-tight tracking-[0.15em] uppercase">years<br />practising</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="grid content-start gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={m.id}
                className="grid gap-5"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-mono text-xs tracking-[0.22em] text-brand uppercase">{m.role}</span>
                <h3 className="font-display text-5xl md:text-6xl">{m.first} <em className="text-brand">{m.last}</em></h3>
                <p className="max-w-xl text-lg leading-relaxed text-moss">{m.bio}</p>

                <dl className="grid gap-5 pt-2 sm:grid-cols-3">
                  {([["Specialties", m.specialties], ["Languages", m.languages], ["Placed in", m.placed]] as const).map(([label, list]) => (
                    <div key={label} className="grid content-start gap-2">
                      <dt className="font-mono text-[0.62rem] tracking-[0.2em] text-moss uppercase">{label}</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {list.map((x) => <span key={x} className="chip text-ink/80">{x}</span>)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="border-t border-ink/10 pt-4 font-mono text-xs tracking-[0.15em] text-moss uppercase">{m.credentials}</p>
              </motion.div>
            </AnimatePresence>

            {/* Switcher */}
            <div role="tablist" aria-label="Specialists" className="flex flex-wrap gap-3">
              {team.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={idx === i}
                  onClick={() => setIdx(i)}
                  className={cn("group flex items-center gap-3 rounded-full border p-1.5 pr-5 transition-colors", idx === i ? "border-brand bg-ink text-paper" : "border-ink/15 hover:border-brand/60")}
                >
                  <span className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={img(t.photo, 160)} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-sm font-medium">{t.first} {t.last}</span>
                    <span className={cn("block text-[0.68rem]", idx === i ? "text-fog" : "text-moss")}>{t.short}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
