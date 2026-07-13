"use client";

import { motion } from "motion/react";
import WorldMap from "@/components/ui/world-map";
import { collaborationRegions } from "@/lib/collaboration-map";
import { collaborationLocations } from "@/lib/data";
import { useIsMobile } from "@/lib/use-is-mobile";

const collaborationContexts = [
  "Nokia",
  "WebGen",
  "open source",
  "friends & family",
  "client projects",
];

export default function GlobalReach({
  compact = false,
}: {
  compact?: boolean;
}) {
  const isMobile = useIsMobile();
  const isCompactLayout = compact || isMobile === true;

  const cityLookup = Object.fromEntries(
    collaborationLocations.map((location) => [location.city, location]),
  );

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
          className="mt-6 overflow-hidden rounded-2xl bg-card ring-1 ring-white/10 sm:mt-10 sm:rounded-3xl"
        >
          <WorldMap compact={isCompactLayout} />

          <div className="border-t border-white/5 px-4 py-5 sm:px-6 sm:py-6">
            <p className="mb-4 text-center text-[0.7rem] leading-relaxed text-muted sm:mb-5 sm:text-sm">
              {isCompactLayout
                ? "Each city is a real collaboration point — colleagues, clients, contributors, or people close to me."
                : "Each city marks where I've actually collaborated with someone — colleagues, clients, contributors, or people close to me. Nothing decorative, nothing made up."}
            </p>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {collaborationRegions.map((region) => (
                <div key={region.id}>
                  <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-accent/80 sm:text-[0.65rem]">
                    {region.label}
                  </p>
                  <ul className="space-y-1.5">
                    {region.cities.map((city) => {
                      const location = cityLookup[city];
                      if (!location) return null;

                      return (
                        <li
                          key={city}
                          className="flex items-baseline justify-between gap-2 text-sm text-[#d4d0e8]"
                        >
                          <span className="font-medium">{city}</span>
                          <span className="text-[0.65rem] text-muted">
                            {location.country}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
