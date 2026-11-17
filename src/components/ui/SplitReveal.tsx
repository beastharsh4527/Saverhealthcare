"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Line-masked word reveal. Animates TRANSFORM only (never opacity from 0),
 * so the text paints on first frame and LCP is unaffected.
 */
export function SplitReveal({
  as: Tag = "h2",
  children,
  className,
  onScroll = true,
  delay = 0,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  onScroll?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const split = SplitText.create(ref.current, {
        type: "lines,words",
        linesClass: "split-line",
        wordsClass: "split-word",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 110,
            rotate: 2,
            duration: 1.2,
            stagger: 0.035,
            delay,
            ease: "expo.out",
            scrollTrigger: onScroll ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
          }),
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
