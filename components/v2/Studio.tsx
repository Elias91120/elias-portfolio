"use client";

import Image from "next/image";
import { contact } from "@/lib/people";
import { useLocale, type L } from "@/lib/i18n";
import { FadeIn, Magnet, PrimaryButton } from "@/components/v2/Primitives";

/**
 * The bridge to 3geeks.fr. The portfolio is about Elias; a visitor who came
 * with a project to build belongs on the studio's site, which is the one kept
 * current. Offers and promises are copied from 3geeks.fr; keep them in sync.
 */
const offers: { name: L; price: L; detail: L }[] = [
  {
    name: { en: "Websites", fr: "Sites web" },
    price: { en: "from €300", fr: "dès 300 €" },
    detail: {
      en: "Showcase sites, redesigns and online shops built to bring in contacts.",
      fr: "Sites vitrines, refontes et boutiques pensés pour faire venir des contacts.",
    },
  },
  {
    name: { en: "Apps & platforms", fr: "Applications & plateformes" },
    price: { en: "on quote", fr: "sur devis" },
    detail: {
      en: "Client portals, iOS apps, dashboards, plugged into the tools you already run.",
      fr: "Portails clients, applis iOS, dashboards, branchés sur vos outils existants.",
    },
  },
  {
    name: { en: "AI & automation", fr: "IA & automatisation" },
    price: { en: "free audit", fr: "audit gratuit" },
    detail: {
      en: "AI wired into invoicing, stock, customer service or reporting.",
      fr: "De l'IA branchée sur la facturation, le stock, le service client ou le reporting.",
    },
  },
];

export default function Studio() {
  const { t } = useLocale();

  return (
    <section
      id="studio"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] top-1/2 h-[70vh] w-[70vw] -translate-y-1/2 opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(240,180,41,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <FadeIn y={28} className="flex flex-col items-start gap-7">
          <Image
            src="/brands/3geeks.png"
            alt="3geeks"
            width={338}
            height={117}
            className="h-9 w-auto opacity-90 sm:h-10"
          />
          <h2
            className="font-display font-bold leading-[1.02] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.6rem)" }}
          >
            {t({
              en: "A project to build? It goes through the studio.",
              fr: "Un projet à construire ? Ça passe par le studio.",
            })}
          </h2>
          <p
            className="max-w-[46ch] font-light leading-[1.7] text-[#C9C4DC]"
            style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}
          >
            {t({
              en: "Noam and I run 3geeks. Small requests ship in 24 to 48 hours, and nothing is paid until you are satisfied.",
              fr: "3geeks, c'est le studio que je dirige avec Noam. Les petites demandes sont livrées en 24 à 48 h, et rien n'est payé avant que vous soyez satisfait.",
            })}
          </p>
          <Magnet padding={60} strength={7}>
            <PrimaryButton href={contact.studioHref}>
              {t({ en: "Visit 3geeks.fr", fr: "Aller sur 3geeks.fr" })}
            </PrimaryButton>
          </Magnet>
        </FadeIn>

        <div className="flex flex-col gap-3 self-center">
          {offers.map((o, i) => (
            <FadeIn key={o.name.en} y={22} delay={0.08 * (i + 1)}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-bold tracking-[-0.01em] sm:text-xl">
                    {t(o.name)}
                  </h3>
                  <span className="text-sm font-medium text-[#f0b429]">
                    {t(o.price)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(o.detail)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
