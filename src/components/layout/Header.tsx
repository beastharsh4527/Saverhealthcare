"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, Phone } from "lucide-react";
import { applyCta, nav, site, tel } from "@/content/site";
import { offices } from "@/content/contact";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 240 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on navigation (state reset keyed to pathname)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-paper transition-transform duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        {/* Topbar */}
        <div
          className={cn(
            "hidden overflow-hidden border-b border-white/10 bg-ink/90 font-mono text-[0.7rem] tracking-[0.12em] text-fog uppercase transition-[max-height,opacity] duration-500 md:block",
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100",
          )}
        >
          <div className="container-x flex h-9 items-center justify-between">
            <div className="flex items-center gap-6">
              <a href={tel(site.phoneUk)} className="flex items-center gap-2 hover:text-paper"><Phone className="h-3 w-3" aria-hidden />{site.phoneUk}</a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 normal-case tracking-normal hover:text-paper"><Mail className="h-3 w-3" aria-hidden />{site.email}</a>
            </div>
            <div className="flex items-center gap-4">
              <span>{site.locations}</span>
              <span className="h-1 w-1 rounded-full bg-mint" />
              <span className="text-mint">{site.support}</span>
            </div>
          </div>
        </div>

        <div className={cn("transition-colors duration-500", scrolled || open ? "bg-ink/80 backdrop-blur-xl" : "bg-transparent")}>
          <div className="container-x flex h-[76px] items-center justify-between gap-6">
            <Logo light size={50} />
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
                {nav.map((item) => (
                  <li key={item.href} className="relative">
                    {isActive(item.href) && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                    )}
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn("relative block rounded-full px-3.5 py-2 text-[0.88rem] transition-colors xl:px-4", isActive(item.href) ? "text-paper" : "text-paper/70 hover:text-paper")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-3">
              <ButtonLink href={applyCta.href} variant="gold" size="sm" className="hidden sm:inline-flex">{applyCta.label}</ButtonLink>
              <button
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
                className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden"
              >
                <span className={cn("absolute h-px w-5 bg-current transition-transform duration-500", open ? "rotate-45" : "-translate-y-1")} />
                <span className={cn("absolute h-px w-5 bg-current transition-transform duration-500", open ? "-rotate-45" : "translate-y-1")} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[96px] text-paper lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto">
              <ul className="grid gap-1 py-6">
                {[...nav, applyCta].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.045, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href={item.href} className="flex items-baseline gap-4 border-b border-white/10 py-3 font-display text-4xl">
                      <span className="font-mono text-xs text-mint">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-x grid gap-2 border-t border-white/10 py-6 text-sm text-fog">
              {offices.map((o) => (
                <a key={o.id} href={tel(o.lines[0].value)} className="flex justify-between">
                  <span>{o.city}</span>
                  <span className="text-paper">{o.lines[0].value}</span>
                </a>
              ))}
              <a href={`mailto:${site.email}`} className="mt-2 text-mint">{site.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
