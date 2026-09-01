"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Site-wide inertial scroll (the "Cuberto" smooth-scroll feel). `root`
 * hijacks the native window scroll rather than wrapping content in its own
 * scroll container, so existing fixed/sticky positioning (Navbar,
 * SiteSidebar) keeps working unchanged.
 *
 * Lenis's `respectReducedMotion` (on by default) disables the smoothing for
 * anyone with `prefers-reduced-motion` set, so no extra handling is needed
 * here for accessibility.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
