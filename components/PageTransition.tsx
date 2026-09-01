"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

/**
 * The actual cross-fade between pages is handled natively by the View
 * Transitions API (see <ViewTransitions> in layout.tsx and the
 * ::view-transition-old/new(root) rules in globals.css) — a browser
 * compositor animation, not something React drives. That's the fix for the
 * Framer Motion/AnimatePresence version of this component, which fought
 * Next.js's App Router unmount timing and looked janky as a result.
 *
 * What's left for this component: snapping the (Lenis-driven) scroll
 * position back to the top on every navigation. The browser's cross-fade
 * doesn't know about Lenis, so without this the new page would inherit
 * whatever scroll position the previous page was left at.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return <>{children}</>;
}
