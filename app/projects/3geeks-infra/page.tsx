import type { Metadata } from "next";
import Image from "next/image";
import { ViewTransition } from "react";
import CaseStudyShell from "@/components/case-study/CaseStudyShell";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyCta from "@/components/case-study/CaseStudyCta";
import CaseStudyMetrics from "@/components/case-study/CaseStudyMetrics";
import DeployFlowDiagram from "@/components/case-study/DeployFlowDiagram";
import InfraStackDiagram from "@/components/case-study/InfraStackDiagram";
import InfraDecor from "@/components/case-study/InfraDecor";
import { getCaseStudyTheme } from "@/lib/case-study-themes";

const theme = getCaseStudyTheme("3geeks-infra");

const impactMetrics = [
  { value: "8+", label: "apps on self-hosted Coolify" },
  { value: "5", label: "public *.3geeks.fr domains" },
  { value: "3", label: "Vercel → self-host migrations" },
  { value: "3", label: "Mac Mini servers" },
];

const infraTags = ["Coolify", "Traefik", "Cloudflare Tunnel", "Docker"];

const hostedServices = [
  { href: "https://www.3geeks.fr", label: "3geeks.fr — studio landing" },
  { href: "https://prompt-hub.3geeks.fr", label: "prompt-hub.3geeks.fr — Prompt Hub" },
  { href: "https://prompt-optim.3geeks.fr", label: "prompt-optim.3geeks.fr — PromptOptim" },
];

export const metadata: Metadata = {
  title: "3geeks Infra — Case Study",
  description:
    "Self-hosted production stack for 3geeks — 3 Mac Mini servers; Coolify, Traefik, and Cloudflare Tunnel on the prod node powering 8+ live apps on *.3geeks.fr.",
  alternates: { canonical: "/projects/3geeks-infra" },
  openGraph: {
    title: "3geeks Infra — Case Study · Elias Elloumi",
    description:
      "From Vercel to a home-lab prod cluster: Coolify deploys, Traefik routing, Cloudflare Tunnel ingress.",
  },
};

export default function ThreeGeeksInfraCaseStudy() {
  return (
    <CaseStudyShell
      theme={theme}
      liveHref="https://www.3geeks.fr"
      liveLabel="Visit 3geeks.fr ↗"
      decor={<InfraDecor />}
    >
      <ViewTransition enter="case-study-content-enter" default="none">
        <div>
          <span
            className="font-display text-xs font-semibold tracking-[0.3em]"
            style={{ color: "var(--cs-kicker)" }}
          >
            CASE STUDY
          </span>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/3geeks-logo.png"
              alt="3geeks logo"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </div>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            3geeks Infra —{" "}
            <span className="font-serif italic font-semibold text-[var(--cs-fg)]">
              self-hosted prod
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--cs-muted)]">
            The production backbone behind 3geeks — the studio runs three Mac
            Mini servers; I consolidated every live{" "}
            <em className="font-serif text-[var(--cs-fg)]">*.3geeks.fr</em>{" "}
            service on one of them with Coolify, Traefik, and Cloudflare Tunnel
            so apps ship without depending on a single PaaS.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {infraTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1.5 text-xs font-medium ring-1"
                style={{
                  color: "var(--cs-accent)",
                  backgroundColor:
                    "color-mix(in srgb, var(--cs-accent) 12%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--cs-accent) 30%, transparent)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </ViewTransition>

      <ViewTransition enter="case-study-content-enter-delay" default="none">
        <div>
          <CaseStudySection title="Impact at a glance">
            <p>
              Real infrastructure running real products — not a homelab demo.
              Every green-stack tool on this portfolio that ends in{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-sm text-[var(--cs-fg)]">
                .3geeks.fr
              </code>{" "}
              lands on this stack.
            </p>
            <CaseStudyMetrics metrics={impactMetrics} />
          </CaseStudySection>

          <CaseStudySection title="The problem">
            <p>
              3geeks ships fast — Prompt Hub, PromptOptim, and more — but
              Vercel bills add up, env vars scatter across dashboards, and there
              is no single place to see what is actually running in production.
            </p>
            <p>
              The studio needed sovereign hosting: one deploy pipeline, one
              reverse proxy, one tunnel — and the ability to migrate apps off
              Vercel without rewriting them.
            </p>
          </CaseStudySection>

          <CaseStudySection title="The stack">
            <p>
              3geeks operates three on-prem Mac Mini servers. Production for{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-sm text-[var(--cs-fg)]">
                *.3geeks.fr
              </code>{" "}
              runs on one of them — OrbStack with a Linux VM hosting Coolify.
              Traefik terminates TLS on port 443 inside the private network.
              Cloudflare Tunnel exposes selected hostnames to the internet —
              every public route goes through Traefik, never directly to a
              container port.
            </p>
            <InfraStackDiagram />
          </CaseStudySection>

          <CaseStudySection title="Golden path — ship to prod">
            <p>
              The deploy workflow is repeatable for every new service: push code
              with a Dockerfile and a health endpoint, let Coolify build and
              deploy, register the hostname in Cloudflare DNS and tunnel ingress,
              verify with a health check. Migrations from Vercel add a permanent
              redirect before cutting the old URL.
            </p>
            <DeployFlowDiagram />
          </CaseStudySection>

          <CaseStudySection title="What runs on it">
            <p>
              The cluster hosts the studio&apos;s live products — frontends,
              APIs, and PostgreSQL databases managed by Coolify:
            </p>
            <ul className="mt-4 space-y-2">
              {hostedServices.map((service) => (
                <li
                  key={service.href}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--cs-muted)]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--cs-accent)" }}
                  />
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 transition-colors hover:text-[var(--cs-fg)] hover:underline"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Private studio services (internal APIs, team tools) stay off the
              public ingress — only documented public products are exposed
              through the tunnel.
            </p>
          </CaseStudySection>

          <CaseStudySection title="What I operate">
            <p>
              I designed and run the prod stack on our primary Mac Mini —
              Coolify app provisioning, Traefik routing rules, Cloudflare DNS
              and tunnel ingress, PostgreSQL on Coolify, env-var management,
              health monitoring, and Vercel migrations with zero-downtime
              redirects. The studio&apos;s two other Mac Minis handle separate
              workloads outside this case study.
            </p>
            <p>
              The goal is not &ldquo;cheap hosting&rdquo; — it is{" "}
              <em className="font-serif text-[var(--cs-fg)]">
                controlled hosting
              </em>
              : know exactly what runs where, deploy in one push, and keep
              European data on infrastructure we operate.
            </p>
          </CaseStudySection>

          <CaseStudyCta description="3geeks Infra is the platform layer under every green-stack product at 3geeks — from intent-to-website generation to mindful AI tools." />
        </div>
      </ViewTransition>
    </CaseStudyShell>
  );
}
