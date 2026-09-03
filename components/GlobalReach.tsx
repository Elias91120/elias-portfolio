"use client";

import { motion } from "framer-motion";
import WorldMap from "@/components/ui/world-map";
import { collaborationRegions } from "@/lib/collaboration-map";
import { collaborationLocations } from "@/lib/data";
import { useIsMobile } from "@/lib/use-is-mobile";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n";

const collaborationContexts = [
  { en: "Nokia", fr: "Nokia" },
  { en: "3geeks", fr: "3geeks" },
  { en: "open source", fr: "open source" },
  { en: "friends & family", fr: "proches" },
  { en: "client projects", fr: "projets clients" },
];

export default function GlobalReach({
  compact = false,
}: {
  compact?: boolean;
}) {
  const isMobile = useIsMobile();
  const { t } = useLocale();
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
        <Reveal>
          <span className="section-kicker font-display text-[0.7rem] font-semibold tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.3em]">
            {t({ en: "ALL OVER THE WORLD", fr: "PARTOUT DANS LE MONDE" })}
          </span>
          <h2
            className={`font-display mt-3 font-bold tracking-tight text-white sm:mt-4 ${
              compact ? "text-2xl" : "text-3xl sm:text-5xl"
            }`}
          >
            {t({ en: "People I've", fr: "Ceux avec qui j'ai" })}{" "}
            <span className="font-display font-semibold text-[#f5f0e4]">
              {t({ en: "built with", fr: "construit" })}
            </span>
          </h2>
          <p
            className={`mt-4 max-w-2xl leading-relaxed text-muted sm:mt-5 ${
              compact ? "text-sm" : "text-sm sm:text-base"
            }`}
          >
            {isCompactLayout ? (
              <>
                {t({
                  en: "Real places where I've collaborated — Nokia, 3geeks, open source, clients, friends & family.",
                  fr: "Des lieux réels où j'ai collaboré — Nokia, 3geeks, open source, clients, proches.",
                })}{" "}
                {collaborationLocations.length}{" "}
                {t({ en: "cities across four continents.", fr: "villes sur quatre continents." })}
              </>
            ) : (
              <>
                {t({
                  en: "Every pin is a real place where I've worked with someone — not a client list on a map, but genuine connection points across the whole journey: Nokia teammates, freelance deliveries, 3geeks, open-source contributors, and projects for friends & family.",
                  fr: "Chaque point est un lieu réel où j'ai travaillé avec quelqu'un — pas une liste de clients sur une carte, mais de vrais points de contact tout au long du parcours : collègues Nokia, livraisons en freelance, 3geeks, contributeurs open source, et projets pour des proches.",
                })}{" "}
                {collaborationLocations.length}{" "}
                {t({ en: "cities, four continents.", fr: "villes, quatre continents." })}
              </>
            )}
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {collaborationContexts.map((context) => (
              <li
                key={context.en}
                className="rounded-full bg-accent/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent ring-1 ring-accent/20 sm:px-3 sm:text-[0.7rem] sm:tracking-[0.15em]"
              >
                {t(context)}
              </li>
            ))}
          </ul>
        </Reveal>

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
                ? t({
                    en: "Each city is a real collaboration point — colleagues, clients, contributors, or people close to me.",
                    fr: "Chaque ville est un vrai point de collaboration — collègues, clients, contributeurs ou proches.",
                  })
                : t({
                    en: "Each city marks where I've actually collaborated with someone — colleagues, clients, contributors, or people close to me. Nothing decorative, nothing made up.",
                    fr: "Chaque ville marque un endroit où j'ai réellement collaboré avec quelqu'un — collègues, clients, contributeurs ou proches. Rien de décoratif, rien d'inventé.",
                  })}
            </p>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {collaborationRegions.map((region) => (
                <div key={region.id}>
                  <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent/80 sm:text-[0.7rem]">
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
                          <span className="text-[0.7rem] text-muted">
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
