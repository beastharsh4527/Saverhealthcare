"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail } from "lucide-react";
import { contactIntro, offices } from "@/content/contact";
import { site, tel } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { useLiveClock } from "@/hooks/useLiveClock";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

function OfficePanel({ o }: { o: (typeof offices)[number] }) {
  const clock = useLiveClock(o.tz);
  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="chip border-mint/40 text-mint">{o.tag}</span>
          <h3 className="mt-3 font-display text-3xl">{o.region}</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl tabular-nums" suppressHydrationWarning>{clock?.time ?? "--:--"}</p>
          <p className={cn("font-mono text-[0.62rem] tracking-[0.18em] uppercase", clock?.open ? "text-mint" : "text-fog")} suppressHydrationWarning>
            {clock ? (clock.open ? "Open now" : "After hours") : " "}
          </p>
        </div>
      </div>
      <address className="text-fog not-italic">{o.address[0]}<br />{o.address[1]}</address>
      <dl className="grid gap-3 border-t border-white/10 pt-5">
        {o.lines.map((l) => (
          <div key={l.label} className="flex items-center justify-between gap-4">
            <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-fog uppercase">{l.label}</dt>
            <dd><a href={tel(l.value)} className="link-underline text-paper hover:text-mint">{l.value}</a></dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4">
          <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-fog uppercase">Email</dt>
          <dd><a href={`mailto:${site.email}`} className="link-underline flex items-center gap-2 text-mint"><Mail className="h-3.5 w-3.5" aria-hidden />{site.email}</a></dd>
        </div>
      </dl>
    </div>
  );
}

/** Flat route arc LON → NYC → DHA, drawn on scroll (kept from the original site). */
function RouteArc() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const paths = ref.current?.querySelectorAll("path");
      if (!paths) return;
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
      });
    },
    { scope: ref },
  );
  return (
    <svg ref={ref} viewBox="0 0 320 90" className="w-full text-gold" aria-hidden>
      <path d="M20 62 Q 85 8 160 50" fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="5 4" />
      <path d="M160 50 Q 240 86 300 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="5 4" />
      {[{ x: 20, y: 62, l: "NYC" }, { x: 160, y: 50, l: "LON" }, { x: 300, y: 30, l: "DHA" }].map((c) => (
        <g key={c.l}>
          <circle cx={c.x} cy={c.y} r="4" className="fill-mint" />
          <text x={c.x} y={c.y + 18} textAnchor="middle" className="fill-current font-mono text-[9px] tracking-[0.15em]">{c.l}</text>
        </g>
      ))}
    </svg>
  );
}

export function Contact() {
  const [active, setActive] = useState(0);
  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div className="container-x grid gap-14">
        <SectionHeading tone="dark" eyebrow={contactIntro.eyebrow} title={contactIntro.title} sub={contactIntro.sub} />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid gap-6">
            <div role="tablist" aria-label="Offices" className="flex gap-2">
              {offices.map((o, i) => (
                <button
                  key={o.id}
                  role="tab"
                  id={`off-tab-${o.id}`}
                  aria-selected={active === i}
                  aria-controls="office-panel"
                  onClick={() => setActive(i)}
                  className={cn("rounded-full border px-5 py-2.5 text-sm transition-colors", active === i ? "border-mint bg-mint/10 text-mint" : "border-white/15 text-fog hover:text-paper")}
                >
                  <span className="mr-2 font-mono text-[0.68rem]">{o.code}</span>{o.city}
                </button>
              ))}
            </div>
            <div id="office-panel" role="tabpanel" aria-labelledby={`off-tab-${offices[active].id}`} className="rounded-3xl border border-white/10 bg-ink-2/70 p-7 backdrop-blur md:p-9">
              <AnimatePresence mode="wait">
                <motion.div key={offices[active].id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                  <OfficePanel o={offices[active]} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="rounded-3xl border border-white/10 p-7">
              <RouteArc />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-2/70 p-7 backdrop-blur md:p-9">
            <div className="mb-7 grid gap-3">
              <span className="eyebrow text-mint">Direct line</span>
              <h3 className="font-display text-3xl">Let&rsquo;s start the conversation.</h3>
              <p className="text-sm text-fog">Tell us a little about you. We typically reply within one business day.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
