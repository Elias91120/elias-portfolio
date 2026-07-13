import type { Metadata } from "next";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import UseCaseScreenGrid from "@/components/case-study/UseCaseScreenGrid";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("green-jardin");

export const metadata: Metadata = {
  title: "Green Jardin — Case Study",
  description:
    "Omnichannel CBD retail: Shopify storefront with Ino Digital, plus a custom staff platform — real-time TV menu, POS, 14% loyalty, and Shopify price sync.",
  alternates: { canonical: "/projects/green-jardin" },
  openGraph: {
    title: "Green Jardin — Case Study · Elias Elloumi",
    description:
      "Live CBD shop online and in-store. Shopify storefront + custom ops platform built for a physical tea salon in Palaiseau.",
  },
};

export default function GreenJardinCaseStudy() {
  return (
    <CaseStudyShell
      theme={theme}
      liveHref="https://green-jardin.fr"
      liveLabel="Visit storefront ↗"
    >
      <ViewTransition enter="case-study-content-enter" default="none">
        <div>
          <span
            className="font-display text-xs font-semibold tracking-[0.3em]"
            style={{ color: "var(--cs-kicker)" }}
          >
            CASE STUDY
          </span>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Green Jardin —{" "}
            <span className="font-serif italic font-semibold text-[var(--cs-fg)]">
              omnichannel CBD retail
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--cs-muted)]">
            A live CBD retailer with a Shopify storefront and a physical tea
            salon in Palaiseau — plus a custom staff platform I built solo to
            run the in-store experience: TV menu, POS checkout, loyalty, and
            Shopify price sync.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--cs-muted)]">
            Storefront designed and built in collaboration with{" "}
            <a
              href="https://linktr.ee/inodigital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--cs-accent)] underline decoration-[var(--cs-accent)]/40 underline-offset-2 transition-colors hover:decoration-[var(--cs-accent)]"
            >
              Ino Digital
            </a>
            . Staff platform, POS, loyalty engine, and Shopify bridge —
            designed and built by Elias.
          </p>
        </div>
      </ViewTransition>

      <ProjectBrowserPreview
        slug="green-jardin"
        imageSrc="/projects/green-jardin.webp"
        imageAlt="Screenshot of Green Jardin Shopify storefront"
        linkLabel="green-jardin.fr"
        priority
        className="mt-10"
      />

      <ViewTransition enter="case-study-content-enter-delay" default="none">
        <div>
          <CaseStudySection title="The client">
            <p>
              Green Jardin is a premium CBD retailer operating both online and
              in-store — flowers, resins, puffs, oils, cosmetics, and
              accessories. Products are lab-certified, THC ≤ 0.3%, and sourced
              from European growers. The physical location doubles as a tea salon
              at 2 Bis Rue Léon Blum, Palaiseau (91), rated 4.8/5 on Google.
            </p>
            <p>
              The business needed more than a web shop: staff sell by the gram
              at the counter, customers see prices on a TV menu, and the online
              catalogue must stay aligned with what happens in the store.
            </p>
          </CaseStudySection>

          <CaseStudySection title="The omnichannel challenge">
            <p>
              Most CBD shops bolt a Shopify theme onto a physical counter and
              hope for the best. Green Jardin needed the opposite — one product
              catalogue, two surfaces (web and in-store TV), and a checkout flow
              that non-technical staff could run during rush hour.
            </p>
            <p>
              The gap: Shopify handles e-commerce beautifully, but it does not
              power a gram-scale POS, a live customer-facing TV, or a 14%
              loyalty wallet that updates in real time while the client is still
              at the counter.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What we shipped — storefront">
            <p>
              The public-facing shop at{" "}
              <a
                href="https://green-jardin.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--cs-accent)] underline decoration-[var(--cs-accent)]/40 underline-offset-2"
              >
                green-jardin.fr
              </a>{" "}
              is a live Shopify storefront, designed and built in collaboration
              with{" "}
              <a
                href="https://linktr.ee/inodigital"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--cs-accent)] underline decoration-[var(--cs-accent)]/40 underline-offset-2"
              >
                Ino Digital
              </a>
              . Product universes (flowers, resins, puffs, oils, cosmetics),
              age verification, trust signals (lab certification, Google
              rating), and a loyalty programme on the web side.
            </p>
            <p>
              The in-store TV menu is embedded on the site via a secure iframe —
              customers browsing online see the same live menu displayed in the
              shop.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What I built — staff platform">
            <p>
              Behind the storefront, I designed and built a private staff
              platform (React + Firebase + Vercel serverless) that runs daily
              operations in the boutique. It is not publicly accessible — only
              the team uses it on shop devices.
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-[var(--cs-muted)]">
              <li>
                <strong className="text-[var(--cs-fg)]">Control hub</strong> —
                four entry points: TV screen, POS sale, menu editor, loyalty
                stats.
              </li>
              <li>
                <strong className="text-[var(--cs-fg)]">TV menu</strong> —
                full-screen product board by category (CBD / Neo ranges), synced
                in real time via Firebase RTDB. Live cart overlays, customer
                greeting, and cashback display while they wait.
              </li>
              <li>
                <strong className="text-[var(--cs-fg)]">POS checkout</strong> —
                three-step flow: loyalty customer → gram/pack products → payment
                (card via SumUp terminal or cash). Guest sales supported.
              </li>
              <li>
                <strong className="text-[var(--cs-fg)]">Loyalty engine</strong> —
                14% cashback on net spend, wallet balance usable as discount,
                Firestore transactions for atomic updates, analytics dashboard
                with revenue charts and top customers.
              </li>
              <li>
                <strong className="text-[var(--cs-fg)]">Menu admin + Shopify bridge</strong> —
                edit in-store prices, compare against Shopify Admin GraphQL,
                push corrections in one click.
              </li>
              <li>
                <strong className="text-[var(--cs-fg)]">Branded email receipts</strong> —
                post-sale receipts sent via serverless API (Nodemailer).
              </li>
              <li>
                <strong className="text-[var(--cs-fg)]">Security</strong> —
                Firebase Auth for staff, JWT verification on all API routes,
                CSP-isolated public iframe so the web embed cannot reach POS or
                admin routes.
              </li>
            </ul>
          </CaseStudySection>

          <CaseStudySection title="My role">
            <p>
              <strong className="text-[var(--cs-fg)]">Storefront:</strong>{" "}
              co-designed and delivered the Shopify experience with Ino
              Digital — product structure, UX, and go-live on green-jardin.fr.
            </p>
            <p>
              <strong className="text-[var(--cs-fg)]">Staff platform:</strong>{" "}
              sole designer and developer — architecture, React frontend, Firebase
              data layer, Vercel serverless APIs (SumUp, Shopify, email),
              deployment, and ongoing maintenance. Code lives in a private
              repository.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Screens in context">
            <p>
              The product spans a public Shopify storefront, an embedded TV
              menu, and a full in-store ops stack — each surface built for its
              audience without compromising the others.
            </p>
            <UseCaseScreenGrid
              screens={[
                {
                  imageSrc: "/projects/green-jardin.webp",
                  imageAlt: "Green Jardin Shopify homepage",
                  linkLabel: "green-jardin.fr",
                  caption:
                    "Shopify storefront — premium positioning, product universes, and trust signals (4.8/5 Google, lab-certified). Built with Ino Digital.",
                },
                {
                  imageSrc: "/projects/green-jardin-shop.webp",
                  imageAlt: "Green Jardin product catalogue",
                  linkLabel: "green-jardin.fr",
                  caption:
                    "E-commerce catalogue — flowers, resins, puffs, and accessories with variant pricing and clear category navigation.",
                },
                {
                  imageSrc: "/projects/green-jardin-tv.webp",
                  imageAlt: "Green Jardin in-store TV menu",
                  caption:
                    "TV menu — full-screen product board synced in real time, embedded on the public site and displayed in the boutique.",
                },
                {
                  imageSrc: "/projects/green-jardin-pos.webp",
                  imageAlt: "Green Jardin POS checkout",
                  caption:
                    "POS checkout — three-column workflow (customer, products, payment) with live sync to the customer-facing TV.",
                },
                {
                  imageSrc: "/projects/green-jardin-shopify-sync.webp",
                  imageAlt: "Green Jardin Shopify price sync panel",
                  caption:
                    "Shopify bridge — compare in-store menu prices against the online catalogue and push corrections in one click.",
                },
                {
                  imageSrc: "/projects/green-jardin-loyalty.webp",
                  imageAlt: "Green Jardin loyalty analytics dashboard",
                  caption:
                    "Loyalty dashboard — revenue trends, registered customers, cashback distributed, and top spenders.",
                },
              ]}
            />
          </CaseStudySection>

          <CaseStudyCta description="Green Jardin is one of webgen's production ships — from a Minecraft kid to omnichannel retail systems and production AI at Nokia." />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
