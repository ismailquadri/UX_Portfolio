"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Aspect-ratio presets so images across a case study aren't all forced into
// the same fixed-pixel box regardless of what's in the shot. Pick a shape
// that fits the content instead of cropping everything to one silhouette.
//
// On mobile every preset collapses to square — the same height as the
// Country-specific onboarding configuration grid — so images read as one
// consistent height on small screens. Each preset's real ratio only takes
// over from `sm:` up.
const ASPECT_CLASSES = {
  wide: "aspect-square sm:aspect-[21/9]", // full-bleed banner / hero anchor shots
  video: "aspect-square sm:aspect-video", // standard 16:9 screenshots
  portrait: "aspect-square sm:aspect-[3/4]", // tall device renders, single-focus shots
  square: "aspect-square", // brand tiles, small supporting shots
} as const;

type CaseStudyImageAspect = keyof typeof ASPECT_CLASSES;

type CaseStudyImageProps = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  /** Aspect-ratio preset. Omit to keep sizing fully controlled by className (legacy behavior). */
  aspect?: CaseStudyImageAspect;
  /** Rounding preset — larger images read better with a more generous radius. */
  radius?: "sm" | "md" | "lg";
  /**
   * Subtle scroll-tied parallax on the image content. The outer box stays
   * put in the layout (no gaps) — only the image inside drifts as it moves
   * through the viewport. Off by default; opt in per image. Automatically
   * disabled for `prefers-reduced-motion`.
   */
  parallax?: boolean;
};

const DEFAULT_SIZES = "(min-width: 640px) 45vw, calc(100vw - 48px)";

const RADIUS_CLASSES = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
} as const;

export default function CaseStudyImage({
  src,
  alt,
  label,
  className = "",
  sizes = DEFAULT_SIZES,
  aspect,
  radius = "md",
  parallax = false,
}: CaseStudyImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const parallaxActive = parallax && !prefersReducedMotion;

  const aspectClass = aspect ? ASPECT_CLASSES[aspect] : "";
  const radiusClass = RADIUS_CLASSES[radius];

  if (!src) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center ${radiusClass} border border-dashed border-border-subtle bg-surface ${aspectClass} ${className}`}
      >
        <p className="px-4 text-center font-body text-[14px] text-[#555]">{label}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${radiusClass} ${aspectClass} ${className}`}
    >
      <motion.div
        className="absolute inset-[-10%]"
        style={parallaxActive ? { y } : undefined}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}
