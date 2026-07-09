import Link from "next/link";
import type { CaseStudyTheme } from "@/lib/case-study-themes";

type CaseStudyShellProps = {
  theme: CaseStudyTheme;
  backHref?: string;
  liveHref?: string;
  liveLabel?: string;
  badge?: string;
  contactHref?: string;
  contactLabel?: string;
  decor?: React.ReactNode;
  children: React.ReactNode;
};

export default function CaseStudyShell({
  theme,
  backHref = "/#projects",
  liveHref,
  liveLabel = "Visit live site ↗",
  badge,
  contactHref,
  contactLabel = "Discuss this project",
  decor,
  children,
}: CaseStudyShellProps) {
  const headerAction = liveHref ? (
    <a
      href={liveHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white ring-1 ring-white/15 transition-all hover:bg-white/10 hover:ring-white/30"
    >
      {liveLabel}
    </a>
  ) : badge ? (
    <span className="inline-flex min-h-11 items-center rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/15">
      {badge}
    </span>
  ) : contactHref ? (
    <Link
      href={contactHref}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white ring-1 ring-white/15 transition-all hover:bg-white/10 hover:ring-white/30"
    >
      {contactLabel}
    </Link>
  ) : null;

  return (
    <main
      className="case-study-page relative min-h-screen"
      style={
        {
          "--cs-bg": theme.bg,
          "--cs-bg-to": theme.bgTo,
          "--cs-fg": theme.fg,
          "--cs-muted": theme.muted,
          "--cs-accent": theme.accent,
          "--cs-kicker": theme.kickerColor,
          "--cs-gold": theme.gold ?? theme.accent,
          "--cs-card": theme.card,
          background: `linear-gradient(165deg, ${theme.bg} 0%, ${theme.bgTo} 100%)`,
          color: theme.fg,
        } as React.CSSProperties
      }
    >
      {decor}

      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/5 backdrop-blur-md"
        style={{
          viewTransitionName: "site-header",
          backgroundColor: `${theme.bg}b3`,
        }}
      >
        <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <Link
            href={backHref}
            transitionTypes={["nav-back"]}
            className="group inline-flex min-h-11 items-center gap-2 text-sm transition-colors"
            style={{ color: theme.muted }}
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
              ←
            </span>
            <span className="group-hover:text-white">Back to portfolio</span>
          </Link>
          {headerAction}
        </nav>
      </header>

      <article className="relative mx-auto max-w-4xl px-5 pb-28 pt-28">
        {children}
      </article>
    </main>
  );
}
