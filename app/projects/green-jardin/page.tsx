import type { Metadata } from "next";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import UseCaseScreenGrid from "@/components/case-study/UseCaseScreenGrid";
import OmnichannelArchDiagram from "@/components/case-study/OmnichannelArchDiagram";
import BeforeAfterComparison, {
  type BeforeAfterItem,
} from "@/components/case-study/BeforeAfterComparison";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("green-jardin");

const opsBeforeAfter: BeforeAfterItem[] = [
  {
    before: "Prices updated separately on the counter board and in Shopify — mismatches found by hand.",
    after: "One in-store menu drives the TV, POS, and a Shopify bridge that compares and fixes prices in one click.",
  },
  {
    before: "Staff called out prices verbally; customers had no live view of their basket.",
    after: "POS checkout pushes a live cart overlay to the customer-facing TV in real time.",
  },
  {
    before: "Loyalty tracked informally — no wallet balance at the counter.",
    after: "14% cashback wallet with Firestore transactions that update atomically during checkout.",
  },
  {
    before: "Receipts handed on paper or not at all.",
    after: "Branded email receipts fired through a serverless API after each sale.",
  },
];

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
            salon in Palaiseau — plus a private staff platform I built solo to
            connect the counter to the web: real-time TV menu, gram-scale POS,
            14% loyalty, and Shopify price sync.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--cs-muted)]">
            Storefront with{" "}
            <a
              href="https://linktr.ee/inodigital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--cs-accent)] underline decoration-[var(--cs-accent)]/40 underline-offset-2 transition-colors hover:decoration-[var(--cs-accent)]"
            >
              Ino Digital
            </a>
            . Staff platform, POS, loyalty engine, and Shopify bridge — designed
            and built by Elias. Internal tooling is not publicly linked.
          </p>
        </div>
      </ViewTransition>

      <ProjectBrowserPreview
        slug="green-jardin"
        imageSrc="/projects/image.png"
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

          <CaseStudySection title="Use case — landing page to counter">
            <p>
              A customer discovers{" "}
              <a
                href="https://green-jardin.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--cs-accent)] underline decoration-[var(--cs-accent)]/40 underline-offset-2"
              >
                green-jardin.fr
              </a>
              , browses product universes, and checks trust signals — lab
              certification, Google rating, loyalty programme. When they walk into
              the tea salon, they see the same live product board on the in-store
              TV: prices, categories, and promotions pulled from the same real-time
              source, embedded on the public site via a secured iframe.
            </p>
            <p>
              At checkout, staff run a three-column POS — customer, products,
              payment — while the TV greets the client by name, shows their
              building basket, and displays their 14% loyalty balance. Card
              payments go through a SumUp terminal; cash is supported too. After
              the sale, a branded receipt lands in their inbox. None of this
              touches the Shopify checkout flow — it is a parallel in-store
              stack built for gram-scale retail.
            </p>
            <p>
              When prices change at the counter, staff compare in-store values
              against the Shopify catalogue and push corrections in one click —
              so the landing page and the boutique never drift apart.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Before vs after — in-store ops">
            <p>
              The staff platform replaced manual workflows that broke under rush
              hour. Same team, same boutique — a different operating model.
            </p>
            <BeforeAfterComparison items={opsBeforeAfter} />
          </CaseStudySection>

          <CaseStudySection title="Architecture">
            <p>
              Firebase Realtime Database is the live nerve centre: the TV menu,
              POS cart overlays, and the public embed all subscribe to the same
              stream. Firestore holds loyalty wallets and checkout transactions
              with atomic updates so balances never go stale mid-sale.
            </p>
            <OmnichannelArchDiagram />
            <p className="mt-6">
              Serverless API routes sit between the staff app and external
              services — Shopify Admin GraphQL for catalogue sync, SumUp for card
              terminals, Nodemailer for receipts. Firebase Auth gates every
              staff route; the public TV embed runs in a CSP-isolated iframe so
              it cannot reach POS or admin surfaces.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What we shipped — storefront">
            <p>
              The public shop is a live Shopify storefront, designed and built
              in collaboration with Ino Digital — product universes, age
              verification, trust signals, and a web-side loyalty programme. The
              in-store TV menu is the bridge: embedded on the site so online
              visitors see exactly what the boutique displays.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What I built — internal ops platform">
            <p>
              A private React + Firebase application that staff use on shop
              devices only. No public URL — the platform exists to run daily
              operations, not to be browsed from outside.
            </p>
            <p>
              <strong className="text-[var(--cs-fg)]">Control hub</strong> —
              four entry points: TV screen, POS sale, menu editor, loyalty stats.
              Everything routes through the same authenticated session.
            </p>
            <p>
              <strong className="text-[var(--cs-fg)]">TV menu</strong> —
              full-screen product board by category (CBD / Neo ranges), synced
              in real time. Live cart overlays, customer greeting, and cashback
              display while they wait at the counter.
            </p>
            <p>
              <strong className="text-[var(--cs-fg)]">POS checkout</strong> —
              three-column workflow: loyalty customer → gram/pack products →
              payment. Guest sales supported. Every cart change propagates to the
              TV within milliseconds.
            </p>
            <p>
              <strong className="text-[var(--cs-fg)]">Loyalty engine</strong> —
              14% cashback on net spend, wallet usable as discount at checkout.
              Firestore transactions ensure the balance updates atomically — no
              double-spend during concurrent edits.
            </p>
            <p>
              <strong className="text-[var(--cs-fg)]">Shopify bridge</strong> —
              side-by-side comparison of in-store menu prices against the online
              catalogue via Admin GraphQL, with one-click push when staff adjust
              a price at the counter.
            </p>
          </CaseStudySection>

          <CaseStudySection title="Screens — public storefront">
            <p>
              The customer-facing surfaces — Shopify theme, product catalogue,
              and trust positioning. Built with Ino Digital for go-live on
              green-jardin.fr.
            </p>
            <UseCaseScreenGrid
              screens={[
                {
                  imageSrc: "/projects/image.png",
                  imageAlt: "Green Jardin Shopify homepage",
                  linkLabel: "green-jardin.fr",
                  caption:
                    "Shopify storefront — premium positioning, product universes, and trust signals (4.8/5 Google, lab-certified).",
                },
                {
                  imageSrc: "/projects/green-jardin-shop.png",
                  imageAlt: "Green Jardin product catalogue",
                  linkLabel: "green-jardin.fr",
                  caption:
                    "E-commerce catalogue — flowers, resins, puffs, and accessories with variant pricing and clear category navigation.",
                },
              ]}
            />
          </CaseStudySection>

          <CaseStudySection title="Screens — in-store ops">
            <p>
              The private staff stack — TV menu, POS, and Shopify sync panel.
              These surfaces are not publicly accessible; screenshots show the
              workflows staff run daily in the boutique.
            </p>
            <UseCaseScreenGrid
              screens={[
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
              ]}
            />
          </CaseStudySection>

          <CaseStudySection title="My role">
            <p>
              <strong className="text-[var(--cs-fg)]">Storefront:</strong>{" "}
              co-designed and delivered the Shopify experience with Ino
              Digital — product structure, UX, and go-live on green-jardin.fr.
            </p>
            <p>
              <strong className="text-[var(--cs-fg)]">Internal ops platform:</strong>{" "}
              sole designer and developer — architecture, React frontend, Firebase
              data layer, serverless APIs (SumUp, Shopify GraphQL, email),
              iframe security model, deployment, and ongoing maintenance.
            </p>
          </CaseStudySection>

          <CaseStudyCta description="Green Jardin is one of 3geeks's production ships — from a Minecraft kid to omnichannel retail systems and production AI at Nokia." />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
