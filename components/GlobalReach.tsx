"use client";

import { motion } from "framer-motion";
import WorldMap from "@/components/ui/world-map";
import { collaborationLocations } from "@/lib/data";
import { useIsMobile } from "@/lib/use-is-mobile";

const collaborationContexts = [
  "Nokia",
  "WebGen",
  "open source",
  "friends & family",
  "client projects",
];

const cityLabelLayout: Record<
  string,
  { x: number; y: number; anchor?: "start" | "middle" | "end" }
> = {
  Seattle: { x: -46, y: -20, anchor: "end" },
  Dallas: { x: 0, y: 24, anchor: "middle" },
  "Washington, D.C.": { x: 52, y: -10, anchor: "start" },
  London: { x: -50, y: -12, anchor: "end" },
  Paris: { x: 0, y: -22, anchor: "middle" },
  Palaiseau: { x: -44, y: 26, anchor: "end" },
  Antony: { x: 42, y: 28, anchor: "start" },
  Wrocław: { x: 48, y: -16, anchor: "start" },
  Espoo: { x: 36, y: -30, anchor: "start" },
  Tunis: { x: -46, y: 8, anchor: "end" },
  Sousse: { x: 48, y: 20, anchor: "start" },
  Dubai: { x: 0, y: -22, anchor: "middle" },
  Bangalore: { x: -52, y: 10, anchor: "end" },
};

export default function GlobalReach({
  compact = false,
}: {
  compact?: boolean;
}) {
  const isMobile = useIsMobile();
  const isCompactLayout = compact || isMobile === true;
  const showMapLabels = !isCompactLayout;

  const mapPoints = collaborationLocations.map((location) => {
    const layout = cityLabelLayout[location.city];
    return {
      lat: location.lat,
      lng: location.lng,
      label: location.city,
      labelOffset: layout ? { x: layout.x, y: layout.y } : undefined,
      labelAnchor: layout?.anchor,
    };
  });

  return (
    <section
      id="global-reach"
      className={`relative overflow-x-hidden px-4 sm:px-5 ${
        compact ? "py-12" : "py-20"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker font-display text-[0.65rem] font-semibold tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">
            ALL OVER THE WORLD
          </span>
          <h2
            className={`font-display mt-3 font-bold tracking-tight text-white sm:mt-4 ${
              compact ? "text-2xl" : "text-3xl sm:text-5xl"
            }`}
          >
            People I&apos;ve{" "}
            <span className="font-serif font-semibold italic text-[#f5f0e4]">
              built with
            </span>
          </h2>
          <p
            className={`mt-4 max-w-2xl leading-relaxed text-muted sm:mt-5 ${
              compact ? "text-sm" : "text-sm sm:text-base"
            }`}
          >
            {isCompactLayout ? (
              <>
                Real places where I&apos;ve collaborated — Nokia, WebGen, open
                source, friends &amp; family, and client work.{" "}
                {collaborationLocations.length} cities across four continents.
              </>
            ) : (
              <>
                Every pin is a real place where I&apos;ve worked with someone —
                not a client list on a map, but genuine connection points
                across my whole journey: Nokia teammates, freelance deliveries,
                WebGen, open-source contributors, and projects for friends
                &amp; family. {collaborationLocations.length} cities, four
                continents.
              </>
            )}
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {collaborationContexts.map((context) => (
              <li
                key={context}
                className="rounded-full bg-accent/10 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-accent ring-1 ring-accent/20 sm:px-3 sm:text-[0.65rem] sm:tracking-[0.15em]"
              >
                {context}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mt-6 overflow-hidden rounded-2xl bg-card p-3 ring-1 ring-white/10 sm:mt-10 sm:rounded-3xl sm:p-6"
        >
          <WorldMap
            points={mapPoints}
            lineColor="#a78bfa"
            showLabels={showMapLabels}
            compact={isCompactLayout}
          />
          <p className="mt-3 px-1 text-center text-[0.7rem] leading-relaxed text-muted sm:mt-4 sm:text-sm">
            {isCompactLayout
              ? "Each city is a real collaboration point — colleagues, clients, contributors, or people close to me."
              : "Each city marks where I've actually collaborated with someone — colleagues, clients, contributors, or people close to me. Nothing decorative, nothing made up."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-5 sm:mt-8"
        >
          <p className="mb-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted sm:hidden">
            {collaborationLocations.length} collaboration cities
          </p>
          <ul
            className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2"
            aria-label="Collaboration cities"
          >
            {collaborationLocations.map((location) => (
              <li
                key={location.city}
                className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs font-medium text-[#d4d0e8] ring-1 ring-white/10 sm:rounded-full sm:px-3 sm:py-1.5"
              >
                {location.city}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
