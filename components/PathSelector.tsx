"use client";

import { motion } from "framer-motion";
import { useVisitorMode } from "@/components/VisitorModeProvider";
import { scrollToSection, prefersReducedMotion } from "@/lib/scroll-to-section";

const ease = [0.22, 1, 0.36, 1] as const;
const easeOut = [0.16, 1, 0.3, 1] as const;

type PathCardProps = {
  title: string;
  subtitle: string;
  badge?: string;
  variant: "hiring" | "browsing";
  onClick: () => void;
  compact?: boolean;
  index: number;
  ready: boolean;
};

function BriefcaseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const variantStyles = {
  hiring: {
    shell: "path-card-hiring",
    iconWrap:
      "bg-gradient-to-br from-violet-500/20 to-accent/10 text-accent ring-accent/25 group-hover:ring-accent/45 group-hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.55)]",
    badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
  },
  browsing: {
    shell: "path-card-browsing",
    iconWrap:
      "bg-gradient-to-br from-sky-500/15 to-violet-500/10 text-sky-300 ring-sky-400/20 group-hover:ring-sky-400/40 group-hover:shadow-[0_0_24px_-4px_rgba(56,189,248,0.45)]",
    badge: "bg-white/5 text-muted ring-white/10",
  },
} as const;

function PathCard({
  title,
  subtitle,
  badge,
  variant,
  onClick,
  compact = false,
  index,
  ready,
}: PathCardProps) {
  const styles = variantStyles[variant];
  const Icon = variant === "hiring" ? BriefcaseIcon : CompassIcon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: compact ? 12 : 16 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: compact ? 12 : 16 }}
      transition={{
        delay: ready ? 0.72 + index * 0.12 : 0,
        duration: 0.7,
        ease: easeOut,
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      className={`path-card group relative w-full overflow-hidden rounded-[1.35rem] p-px text-left transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer ${styles.shell}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 path-card-shine"
      />

      <span
        className={`relative flex w-full items-center gap-3.5 overflow-hidden rounded-[1.3rem] bg-[#0c0a16]/75 backdrop-blur-xl ${
          compact ? "px-4 py-3.5" : "px-5 py-4 sm:py-[1.125rem]"
        }`}
      >
        <span
          aria-hidden
          className={`flex shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-500 ${
            compact ? "h-10 w-10" : "h-11 w-11"
          } ${styles.iconWrap}`}
        >
          <Icon />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span
              className={`font-display font-semibold tracking-tight text-white transition-colors group-hover:text-white ${
                compact ? "text-[0.95rem]" : "text-base sm:text-[1.05rem]"
              }`}
            >
              {title}
            </span>
            {badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider ring-1 ${styles.badge}`}
              >
                {badge}
              </span>
            )}
          </span>
          <span
            className={`mt-0.5 block leading-snug text-muted/85 transition-colors group-hover:text-muted ${
              compact ? "text-[0.68rem]" : "text-xs sm:text-[0.8125rem]"
            }`}
          >
            {subtitle}
          </span>
        </span>

        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-muted/70 ring-1 ring-white/8 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white/[0.08] group-hover:text-accent group-hover:ring-accent/25"
        >
          <ChevronIcon />
        </span>
      </span>
    </motion.button>
  );
}

type PathSelectorProps = {
  ready: boolean;
  compact?: boolean;
};

export default function PathSelector({ ready, compact = false }: PathSelectorProps) {
  const { mode, setMode, hydrated } = useVisitorMode();

  if (!hydrated || mode !== null) return null;

  const behavior = prefersReducedMotion() ? "auto" : "smooth";

  const chooseHiring = () => {
    setMode("hiring");
    requestAnimationFrame(() => scrollToSection("#proof", behavior));
  };

  const chooseBrowsing = () => {
    setMode("browsing");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ delay: ready ? 0.66 : 0, duration: 0.65, ease }}
      className={`w-full max-w-lg ${compact ? "mt-5" : "mt-8"}`}
      role="group"
      aria-label="Choose how to explore the portfolio"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p
          className={`shrink-0 uppercase tracking-[0.32em] text-muted/90 ${
            compact ? "text-[0.58rem]" : "text-[0.62rem] sm:text-[0.65rem]"
          }`}
        >
          How would you like to explore?
        </p>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div
        className={`grid grid-cols-1 gap-3 ${compact ? "" : "sm:grid-cols-2 sm:gap-3.5"}`}
      >
        <PathCard
          title="I'm hiring"
          subtitle={
            compact
              ? "Stats, projects & contact"
              : "Stats, projects & contact — fast path"
          }
          badge="Fast track"
          variant="hiring"
          onClick={chooseHiring}
          compact={compact}
          index={0}
          ready={ready}
        />
        <PathCard
          title="Just browsing"
          subtitle={
            compact ? "The full scroll story" : "The full scroll story — one chapter at a time"
          }
          variant="browsing"
          onClick={chooseBrowsing}
          compact={compact}
          index={1}
          ready={ready}
        />
      </div>
    </motion.div>
  );
}
