"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { educationPath } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

const statusStyles = {
  completed: "bg-black/35 text-[#efeaf8] ring-white/20",
  current: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/35",
  upcoming: "bg-black/35 text-[#efeaf8] ring-white/20",
} as const;

const educationArt: Record<
  string,
  { src: string; alt: string }
> = {
  "ECE Paris": {
    src: "/story/chapter-4.jpg",
    alt: "Illustrated scene of Elias presenting at ECE Paris",
  },
  "EFREI Paris": {
    src: "/story/chapter-7.jpg",
    alt: "Illustrated dawn city and data constellation for the next degree",
  },
  Apprenticeship: {
    src: "/art/edu-door.png",
    alt: "A door opening onto warm light, the next chapter of the path",
  },
};

export default function EducationTimeline({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      id="education"
      className={`relative px-5 ${compact ? "py-12" : "py-20"}`}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2
            className={`font-display font-bold tracking-tight text-white ${
              compact ? "text-2xl" : "text-3xl sm:text-4xl"
            }`}
          >
            Where I{" "}
            <span className="font-serif italic font-semibold text-[#f5f0e4]">
              am now
            </span>
          </h2>
          {!compact && (
            <p className="mt-4 max-w-2xl text-muted leading-relaxed">
              Final year of my Bachelor at ECE Paris. Next, the M.Sc. at EFREI
              and a two-year apprenticeship in data engineering and AI.
            </p>
          )}
        </Reveal>

        <div
          className={`mt-10 grid gap-4 ${
            compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {educationPath.map((step, i) => {
            const art = educationArt[step.title];
            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-white/8"
              >
                {art && (
                  <div className={`relative ${compact ? "aspect-[16/9]" : "aspect-[5/4]"}`}>
                    <Image
                      src={art.src}
                      alt={art.alt}
                      fill
                      sizes="(min-width: 768px) 20rem, 92vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120e20] via-[#120e20]/20 to-transparent" />
                    {step.status === "current" && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-300/35 backdrop-blur-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Final year
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusStyles[step.status]}`}
                  >
                    {step.years.replace("—", "-")}
                  </div>
                  <h3 className="font-display mt-3 text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.subtitle.replace("—", "-")}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
