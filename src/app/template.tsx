"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

// First load is covered by the Preloader; only client-side navigations get the curtain.
const nav = { done: false };

/**
 * Enter-only page transition. Exit animations don't fire reliably in App Router
 * templates, so a brand curtain sweeps OFF the new page instead.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // A new Template instance mounts on every navigation; read the flag once per mount.
  const [animate] = useState(() => nav.done && !reduce);
  useEffect(() => {
    nav.done = true;
  }, []);

  return (
    <>
      {animate && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[70] bg-brand"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink"
            initial={{ clipPath: "inset(0 0 0% 0)" }}
            animate={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
      <motion.div
        initial={animate ? { y: 60 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
