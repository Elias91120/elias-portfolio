"use client";

import { motion, useReducedMotion } from "framer-motion";

const pins = [
  { cx: 120, cy: 95, delay: 0 },
  { cx: 280, cy: 72, delay: 0.3 },
  { cx: 340, cy: 130, delay: 0.6 },
  { cx: 420, cy: 88, delay: 0.9 },
  { cx: 200, cy: 155, delay: 1.2 },
];

export default function TravelMapDecor({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-20 ${className}`.trim()}
      aria-hidden
    >
      <svg
        viewBox="0 0 520 220"
        className="absolute -left-4 top-20 h-auto w-[min(90%,32rem)]"
        fill="none"
      >
        {/* Stylized world map arcs */}
        <ellipse
          cx="260"
          cy="110"
          rx="220"
          ry="90"
          stroke="var(--cs-accent)"
          strokeOpacity="0.2"
          strokeWidth="1"
          fill="var(--cs-accent)"
          fillOpacity="0.04"
        />
        <path
          d="M60 110 Q160 60 260 80 T460 110"
          stroke="var(--cs-accent)"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <path
          d="M80 140 Q200 170 320 150 T480 120"
          stroke="var(--cs-accent)"
          strokeOpacity="0.15"
          strokeWidth="1"
        />
        {pins.map((pin, i) => (
          <g key={i}>
            <motion.circle
              cx={pin.cx}
              cy={pin.cy}
              r="12"
              fill="var(--cs-accent)"
              fillOpacity="0.12"
              animate={reduce ? {} : { r: [12, 16, 12], opacity: [0.12, 0.06, 0.12] }}
              transition={{
                duration: 3,
                delay: pin.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.circle
              cx={pin.cx}
              cy={pin.cy}
              r="4"
              fill="var(--cs-accent)"
              initial={{ scale: reduce ? 1 : 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: pin.delay, duration: 0.5 }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
