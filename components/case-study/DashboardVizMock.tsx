"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

function BarChart() {
  const reduce = useReducedMotion();
  const bars = [42, 68, 55, 82, 61, 74, 48];

  return (
    <div
      className="rounded-2xl p-5 ring-1 ring-white/10"
      style={{ backgroundColor: "var(--cs-card)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--cs-muted)]">
          Feature coverage
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ backgroundColor: "var(--cs-accent)", opacity: 0.7 + i * 0.04 }}
            initial={{ height: reduce ? `${h}%` : "0%" }}
            animate={{ height: `${h}%` }}
            transition={{
              duration: reduce ? 0 : 1.2,
              delay: reduce ? 0 : i * 0.08,
              ease,
              repeat: reduce ? 0 : Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Sparkline() {
  const reduce = useReducedMotion();
  const points = "0,40 20,32 40,36 60,20 80,24 100,8 120,12";

  return (
    <div
      className="rounded-2xl p-5 ring-1 ring-white/10"
      style={{ backgroundColor: "var(--cs-card)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--cs-muted)]">
          Pipeline throughput
        </span>
        <span className="font-mono text-xs text-[var(--cs-accent)]">+12%</span>
      </div>
      <svg viewBox="0 0 120 48" className="h-16 w-full">
        <polyline
          points={points}
          fill="none"
          stroke="var(--cs-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />
        <motion.polyline
          points={points}
          fill="none"
          stroke="var(--cs-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: reduce ? 0 : 2,
            ease,
            repeat: reduce ? 0 : Infinity,
            repeatDelay: 3,
          }}
        />
      </svg>
    </div>
  );
}

function DonutChart() {
  const reduce = useReducedMotion();
  const r = 28;
  const c = 2 * Math.PI * r;

  return (
    <div
      className="rounded-2xl p-5 ring-1 ring-white/10"
      style={{ backgroundColor: "var(--cs-card)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--cs-muted)]">
          Source health
        </span>
        <span className="text-xs text-[var(--cs-muted)]">7 sources</span>
      </div>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 72 72" className="h-16 w-16 shrink-0">
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="white"
            strokeOpacity="0.08"
            strokeWidth="8"
          />
          <motion.circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="var(--cs-accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            transform="rotate(-90 36 36)"
            initial={{ strokeDashoffset: reduce ? c * 0.22 : c }}
            animate={{ strokeDashoffset: c * 0.22 }}
            transition={{
              duration: reduce ? 0 : 1.8,
              ease,
              repeat: reduce ? 0 : Infinity,
              repeatType: "reverse",
              repeatDelay: 2.5,
            }}
          />
        </svg>
        <div className="space-y-1 text-xs text-[var(--cs-muted)]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--cs-accent)]" />
            Active · 5
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            Syncing · 2
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardVizMock() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <BarChart />
      <Sparkline />
      <DonutChart />
    </div>
  );
}
