"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  FadeIn                                                             */
/* ------------------------------------------------------------------ */

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.9,
  x = 0,
  y = 28,
  as = "div",
  onMount = false,
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: "div" | "span" | "li" | "section" | "p" | "h2";
  /**
   * Play on mount instead of on scroll. Required above the fold: an element
   * that starts offset inside an `overflow-hidden` mask can be clipped to a
   * zero-area rect, and then `whileInView` never fires and it stays hidden.
   */
  onMount?: boolean;
  /**
   * Set false to slide without fading. The browser does not count an element
   * as painted while its opacity is 0, so fading the largest image in the
   * hero pushes Largest Contentful Paint out by the length of the animation.
   */
  fade?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = motion.create(as);
  const from = reduce ? false : fade ? { opacity: 0, x, y } : { x, y };
  const to = fade ? { opacity: 1, x: 0, y: 0 } : { x: 0, y: 0 };

  if (onMount) {
    return (
      <Tag
        className={className}
        initial={from}
        animate={to}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      initial={from}
      whileInView={to}
      viewport={{ once: true, margin: "80px", amount: 0 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Magnet — cursor-following wrapper                                  */
/* ------------------------------------------------------------------ */

export function Magnet({
  children,
  className,
  padding = 120,
  strength = 4,
}: {
  children: ReactNode;
  className?: string;
  padding?: number;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform", transition: "transform 0.6s ease-in-out" }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const inside =
          Math.abs(dx) < r.width / 2 + padding &&
          Math.abs(dy) < r.height / 2 + padding;
        if (!inside) return;
        el.style.transition = "transform 0.3s ease-out";
        el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = "transform 0.6s ease-in-out";
        el.style.transform = "translate3d(0,0,0)";
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */

export function PrimaryButton({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group relative inline-flex min-h-[48px] items-center gap-3 rounded-full px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-white transition-transform duration-500 hover:scale-[1.03] sm:px-10 sm:py-4 sm:text-sm ${className}`}
      style={{
        background:
          "linear-gradient(123deg, #241041 6%, #6d3ad4 38%, #a78bfa 72%, #f0b429 100%)",
        boxShadow:
          "0 4px 24px rgba(120, 72, 220, 0.35), inset 4px 4px 14px rgba(167, 139, 250, 0.45)",
        outline: "1.5px solid rgba(255,255,255,0.9)",
        outlineOffset: "-3px",
      }}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-500 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}

export function GhostButton({
  children,
  href,
  className = "",
  external = false,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-white/25 px-6 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.06] sm:px-8 sm:py-3 sm:text-xs ${className}`}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  AnimatedText — word-by-word scroll reveal                          */
/* ------------------------------------------------------------------ */

export function AnimatedText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = text.split(" ");

  if (reduce)
    return (
      <p className={className} style={style}>
        {text}
      </p>
    );

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1.6) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      {" "}
    </motion.span>
  );
}
