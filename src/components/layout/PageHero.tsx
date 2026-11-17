import Link from "next/link";
import type { ReactNode } from "react";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

/** Dark animated hero used by every inner page. */
export function PageHero({
  eyebrow,
  title,
  sub,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink pt-40 pb-20 text-paper md:pt-48 md:pb-28">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[38rem] w-[38rem] rounded-full bg-brand/30 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-[40rem] rounded-full bg-gold/10 blur-[120px]" />
      <div className="container-x relative z-[2] grid gap-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] tracking-[0.18em] text-fog uppercase">
            <li><Link href="/" className="hover:text-paper">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {c.href ? <Link href={c.href} className="hover:text-paper">{c.label}</Link> : <span className="text-paper" aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <span className="eyebrow text-mint">{eyebrow}</span>
        <SplitReveal as="h1" onScroll={false} className="display-xl max-w-[16ch]">{title}</SplitReveal>
        {sub && (
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-fog md:text-xl">{sub}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
