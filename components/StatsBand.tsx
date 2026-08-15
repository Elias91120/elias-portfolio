"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView } from "framer-motion";
import { projects } from "@/lib/data";

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  image: string;
  imageAlt: string;
  wide?: boolean;
};

const shippedCount = projects.length;

const stats: Stat[] = [
  {
    value: shippedCount,
    suffix: "+",
    label: "projects shipped and live",
    image: "/art/proof-shipped.png",
    imageAlt: "Painted desk with glowing product windows lifting into the night",
    wide: true,
  },
  {
    value: 7,
    suffix: "+",
    label: "data sources, one Nokia dashboard",
    image: "/art/proof-streams.png",
    imageAlt: "Seven luminous data rivers merging into one orb",
  },
  {
    value: 3,
    label: "friends behind 3geeks",
    image: "/story/chapter-6.jpg",
    imageAlt: "Three friends fist-bumping in the 3geeks studio at night",
  },
  {
    value: 1,
    prefix: "#",
    label: "Bachelor project at ECE Paris",
    image: "/story/chapter-4.jpg",
    imageAlt: "Illustrated presentation of the AI travel planner at ECE",
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
    <span className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
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
    <section id="proof" aria-label="Key numbers" className="relative px-5 py-16 sm:py-24">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat, i) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative overflow-hidden rounded-[1.75rem] ${
              stat.wide ? "min-h-[18rem] sm:col-span-2 lg:min-h-[22rem]" : "min-h-[16rem]"
            }`}
          >
            <Image
              src={stat.image}
              alt={stat.imageAlt}
              fill
              sizes={stat.wide ? "(min-width: 1024px) 42rem, 92vw" : "(min-width: 1024px) 20rem, 46vw"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08060f] via-[#08060f]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <CountUp stat={stat} start={inView} />
              <p className="mt-2 max-w-[16rem] text-sm leading-snug text-[#d7d2ea]">
                {stat.label}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
