"use client";

import { contact } from "@/lib/people";
import { profile, ui } from "@/lib/content";
import { useLocale } from "@/lib/i18n";
import {
  FadeIn,
  GhostButton,
  Magnet,
  PrimaryButton,
} from "@/components/v2/Primitives";

const year = new Date().getFullYear();

export default function Contact() {
  const { t } = useLocale();

  return (
    <>
      <section
        id="contact"
        className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-36"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[110vw] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-[110px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(126,86,214,0.42) 0%, rgba(240,180,41,0.1) 45%, transparent 72%)",
          }}
        />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <FadeIn y={22}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {t(profile.status)}
            </span>
          </FadeIn>

          <FadeIn y={32} delay={0.08}>
            <h2
              className="hero-heading max-w-[14ch] font-display font-bold uppercase leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.1rem, 6.4vw, 5.25rem)" }}
            >
              {t({
                en: "Let's build something real",
                fr: "On construit quelque chose de réel",
              })}
            </h2>
          </FadeIn>

          <FadeIn y={22} delay={0.16}>
            <p
              className="max-w-xl font-light leading-[1.75] text-[#C9C4DC]"
              style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}
            >
              {t({
                en: "Freelance projects, product collaborations, or just a question about something you saw here — my inbox is open.",
                fr: "Projets en freelance, collaborations produit, ou simplement une question sur ce que vous avez vu ici — ma boîte mail est ouverte.",
              })}
            </p>
          </FadeIn>

          <FadeIn
            y={22}
            delay={0.24}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <Magnet padding={70} strength={8}>
              <PrimaryButton href={`mailto:${contact.email}`}>
                {t(ui.contactCta)}
              </PrimaryButton>
            </Magnet>
            <GhostButton href={contact.linkedin} external>
              LinkedIn
            </GhostButton>
            <GhostButton href={contact.github} external>
              GitHub
            </GhostButton>
          </FadeIn>

          <FadeIn
            y={18}
            delay={0.32}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted"
          >
            <span>{t(contact.location)}</span>
            <span aria-hidden className="text-white/15">
              ·
            </span>
            <span>{t(contact.languages)}</span>
            <span aria-hidden className="text-white/15">
              ·
            </span>
            <a
              href={`mailto:${contact.email}`}
              className="-my-3.5 inline-block py-3.5 transition-colors duration-300 hover:text-foreground"
            >
              {contact.email}
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Extra bottom room so the assistant bubble never sits on the credits. */}
      <footer className="border-t border-white/[0.07] px-5 pb-24 pt-8 sm:px-8 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row">
          <p>
            © {year} Elias Elloumi ·{" "}
            <a
              href={contact.studio}
              target="_blank"
              rel="noreferrer"
              className="-my-3.5 inline-block py-3.5 transition-colors duration-300 hover:text-foreground"
            >
              {contact.studioLabel}
            </a>
          </p>
          <p className="text-muted/70">
            {t({
              en: "Built with Next.js and three.js.",
              fr: "Fait avec Next.js et three.js.",
            })}
          </p>
        </div>
      </footer>
    </>
  );
}
