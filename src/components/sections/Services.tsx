"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { services, servicesCta, servicesIntro } from "@/content/services";
import { site, tel } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { img } from "@/lib/utils";

function Card({ s }: { s: (typeof services)[number] }) {
  return (
    <Link
      href={`/services/${s.slug}`}
      data-cursor="View"
      className="svc-card group relative flex h-[26rem] w-[min(84vw,24rem)] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-7 transition-colors duration-500 hover:border-mint/40 md:h-[30rem]"
    >
      <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-25">
        <Image src={img(s.photo, 800)} alt="" fill sizes="24rem" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      </div>
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-sm text-mint">{s.n}</span>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-paper/80 transition-all duration-500 group-hover:rotate-45 group-hover:border-mint group-hover:text-mint">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="relative grid gap-4">
        <ServiceIcon name={s.icon} className="h-9 w-9 text-mint" />
        <h3 className="font-display text-3xl leading-tight">{s.title}</h3>
        <p className="text-sm leading-relaxed text-fog">{s.desc}</p>
        <ul className="flex flex-wrap gap-2 pt-1">
          {s.tags.map((t) => <li key={t} className="chip text-paper/70">{t}</li>)}
        </ul>
      </div>
    </Link>
  );
}

export function Services() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      // Pinned horizontal scroll ≥768px only; below it the cards swipe natively.
      mm.add("(min-width: 768px)", () => {
        const el = track.current!;
        const getX = () => -(el.scrollWidth - el.clientWidth);
        const tween = gsap.to(el, {
          x: getX,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${el.scrollWidth - el.clientWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        const prog = gsap.to(".svc-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${el.scrollWidth - el.clientWidth}`, scrub: true },
        });
        return () => { tween.scrollTrigger?.kill(); tween.kill(); prog.scrollTrigger?.kill(); prog.kill(); };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <>
      <section ref={root} className="grain relative overflow-hidden bg-ink py-20 text-paper md:flex md:min-h-screen md:flex-col md:justify-center md:py-0">
        <div className="container-x relative z-[2] mb-10 md:mb-14">
          <SectionHeading tone="dark" eyebrow={servicesIntro.eyebrow} title={servicesIntro.title} sub={servicesIntro.sub} />
        </div>
        <div className="relative z-[2] overflow-x-auto pb-4 md:overflow-visible md:pb-0">
          <div ref={track} className="flex gap-5 px-[max(1.25rem,calc((100vw-1360px)/2+1.25rem))] will-change-transform md:pr-[40vw]">
            {services.map((s) => <Card key={s.slug} s={s} />)}
          </div>
        </div>
        <div className="container-x relative z-[2] mt-10 hidden md:block">
          <div className="h-px w-full bg-white/10">
            <div className="svc-progress h-px origin-left scale-x-0 bg-mint" />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink pb-24 text-paper">
        <Reveal className="container-x grid gap-8 rounded-3xl py-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-4">
            <span className="eyebrow text-mint">{servicesCta.eyebrow}</span>
            <p className="display-md max-w-[20ch]">{servicesCta.title}</p>
            <p className="max-w-xl text-fog">{servicesCta.text}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <ButtonLink href={servicesCta.button.href} variant="primary" size="lg">{servicesCta.button.label}</ButtonLink>
            <span className="text-sm text-fog">{servicesCta.call} <a className="link-underline text-paper" href={tel(site.phoneUk)}>{site.phoneUk}</a></span>
          </div>
        </Reveal>
      </section>
    </>
  );
}
