"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, type L } from "@/lib/i18n";
import { FadeIn } from "@/components/v2/Primitives";
import type { GeekoActivity, GeekoHandle } from "@/lib/geeko/geeko";

/**
 * Geeks Code, the studio's IDE, shown the way it feels to use: Geeko, the
 * 3geeks mascot, follows what Claude is doing. The engine is the one the IDE
 * and 3geeks.fr run (lib/geeko/geeko.ts); it is fetched only when the section
 * comes into view, and never with reduced motion (the portrait stays).
 * Features listed here are the milestones marked done in the Geeks Code plan.
 */

const features: { title: L; body: L }[] = [
  {
    title: { en: "One sign-in, everything wired", fr: "Une connexion, tout est branché" },
    body: {
      en: "The studio's single sign-on opens the IDE and sets up the Git forge, Workspace, the infrastructure and Claude on a blank machine.",
      fr: "L'authentification unique du studio ouvre l'IDE et installe la forge Git, Workspace, l'infra et Claude sur un poste vierge.",
    },
  },
  {
    title: { en: "Claude at the core", fr: "Claude au cœur" },
    body: {
      en: "Claude opens in the side bar, the agent window runs on it, and a live room shows every agent of a workflow at work.",
      fr: "Claude s'ouvre dans la barre latérale, la fenêtre Agents tourne dessus, et une salle montre en direct chaque agent d'un workflow.",
    },
  },
  {
    title: { en: "The project at a glance", fr: "Le projet d'un coup d'œil" },
    body: {
      en: "On opening, the project is pulled up to date and summarised; its milestones, the infrastructure and the team's skills each get a page.",
      fr: "À l'ouverture, le projet est mis à jour et résumé ; ses jalons, l'infra et les skills de l'équipe ont chacun leur page.",
    },
  },
];

/** One Claude session, replayed: what Claude does, and the scene Geeko plays for it. */
const steps: { activity: GeekoActivity; ms: number; label: L }[] = [
  { activity: "think", ms: 5000, label: { en: "Claude thinks", fr: "Claude réfléchit" } },
  { activity: "code", ms: 7000, label: { en: "edits the files", fr: "modifie les fichiers" } },
  { activity: "servers", ms: 7000, label: { en: "runs the commands", fr: "lance les commandes" } },
  { activity: "party", ms: 5000, label: { en: "it ships", fr: "c'est livré" } },
];

function GeekoStage({ onStep }: { onStep: (i: number) => void }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let handle: GeekoHandle | null = null;
    let timer = 0;
    let step = 0;
    let disposed = false;

    const play = () => {
      if (!handle) return;
      handle.setActivity(steps[step].activity);
      onStep(step);
      timer = window.setTimeout(() => {
        step = (step + 1) % steps.length;
        play();
      }, steps[step].ms);
    };
    const start = async () => {
      let engine: typeof import("@/lib/geeko/geeko");
      try {
        engine = await import("@/lib/geeko/geeko");
      } catch {
        return; // Decoration: without it the portrait stays and the section is whole.
      }
      if (disposed || handle) return;
      // 1 = 80 × 72 px; the stage (servers, desk) appears from 1.5 up.
      const size = window.matchMedia("(min-width: 768px)").matches ? 3.6 : 3;
      handle = engine.createGeeko(document, {
        activity: steps[step].activity,
        size,
        eggs: false,
        // Its bubbles are written for the team, in French: the caption below says it instead.
        say: () => null,
      });
      host.appendChild(handle.element);
      setLive(true);
      play();
    };
    const stop = () => {
      window.clearTimeout(timer);
      handle?.dispose();
      handle = null;
      setLive(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? void start() : stop()),
      { rootMargin: "120px" },
    );
    observer.observe(host);
    return () => {
      disposed = true;
      observer.disconnect();
      stop();
    };
  }, [onStep]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      // Nudged left: the server scene draws its terminal past Geeko's right edge.
      className="relative flex aspect-[10/9] w-full max-w-[340px] items-center justify-center md:-translate-x-5"
    >
      {!live && (
        // eslint-disable-next-line @next/next/no-img-element -- 4 KB pixel-art SVG, nothing to optimise
        <img src="/geeko/portrait.svg" alt="" className="h-1/2 w-auto [image-rendering:pixelated]" />
      )}
    </div>
  );
}

export default function GeeksCode() {
  const { t } = useLocale();
  const [current, setCurrent] = useState(0);

  return (
    <section
      id="geeks-code"
      data-project-slug="geeks-code"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15vw] top-1/3 h-[60vh] w-[60vw] opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(194,251,4,0.3) 0%, rgba(16,234,170,0.12) 45%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="flex flex-col gap-7">
          <FadeIn y={28}>
            <h2
              className="font-display font-bold leading-[1.02] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 4.6vw, 3.6rem)" }}
            >
              {t({
                en: "Geeks Code, the IDE we built for ourselves.",
                fr: "Geeks Code, l'IDE qu'on s'est construit.",
              })}
            </h2>
          </FadeIn>
          <FadeIn y={22} delay={0.08}>
            <p
              className="max-w-[52ch] font-light leading-[1.7] text-[#C9C4DC]"
              style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}
            >
              {t({
                en: "Our own build of VS Code, in the 3geeks colours, for the whole team. And Geeko, our mascot, follows what Claude is doing, right above where you type to it.",
                fr: "Notre propre version de VS Code, aux couleurs de 3geeks, pour toute l'équipe. Et Geeko, notre mascotte, suit ce que fait Claude, juste au-dessus de là où on lui écrit.",
              })}
            </p>
          </FadeIn>
          <div className="mt-2 flex flex-col gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title.en} y={20} delay={0.12 + 0.06 * i}>
                <div className="border-l-2 border-[#c2fb04]/50 pl-4">
                  <h3 className="font-display text-base font-semibold tracking-[-0.01em] text-white sm:text-lg">
                    {t(f.title)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t(f.body)}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn y={18} delay={0.3}>
            <p className="text-xs text-muted">
              {t({
                en: "Internal to the studio: no public download.",
                fr: "Interne au studio : pas de téléchargement public.",
              })}
            </p>
          </FadeIn>
        </div>

        <FadeIn y={28} delay={0.1}>
          <figure className="flex flex-col items-center gap-6 rounded-[32px] border border-white/[0.08] bg-[#0b0d12] px-6 pb-7 pt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <GeekoStage onStep={setCurrent} />
            <figcaption className="w-full">
              <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {steps.map((s, i) => (
                  <li
                    key={s.activity}
                    aria-current={i === current ? "step" : undefined}
                    className={`rounded-full px-3 py-1.5 text-center text-[0.72rem] font-medium transition-colors duration-500 ${
                      i === current
                        ? "bg-[#c2fb04] text-[#0b0d12]"
                        : "bg-white/[0.04] text-muted"
                    }`}
                  >
                    {t(s.label)}
                  </li>
                ))}
              </ol>
            </figcaption>
          </figure>
        </FadeIn>
      </div>
    </section>
  );
}
