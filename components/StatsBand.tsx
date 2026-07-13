"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  accent: string;
};

const stats: Stat[] = [
  {
    value: 7,
    label: "products shipped & live",
    accent: "#4ade80",
  },
  {
    value: 7,
    suffix: "+",
    label: "data sources, one Nokia dashboard",
    accent: "#38bdf8",
  },
  {
    value: 3,
    label: "friends behind webgen",
    accent: "#c084fc",
  },
  {
    value: 1,
    prefix: "#",
    label: "Bachelor project at ECE Paris",
    accent: "#fbbf24",
  },
];

function CountUp({ stat, start }: { stat: Stat; start: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(0, stat.value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, stat.value]);

  return (
    <span
      className="font-display text-5xl font-bold tracking-tight sm:text-6xl"
      style={{ color: stat.accent }}
    >
      {stat.prefix}
      {display}
      {stat.suffix}
    </span>
  );
}

export default function StatsBand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="proof" aria-label="Key numbers" className="relative px-5 py-20">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <CountUp stat={stat} start={inView} />
            <span className="max-w-[12rem] text-sm leading-snug text-muted">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
