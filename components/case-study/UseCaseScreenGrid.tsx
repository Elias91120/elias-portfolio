import Image from "next/image";
import ProjectBrowserPreview from "@/components/ProjectBrowserPreview";

export type UseCaseScreen = {
  slug?: string;
  imageSrc?: string;
  imageAlt: string;
  linkLabel?: string;
  caption: string;
  mock?: React.ReactNode;
};

type UseCaseScreenGridProps = {
  screens: UseCaseScreen[];
};

function ScreenFrame({ screen }: { screen: UseCaseScreen }) {
  if (screen.mock) {
    return (
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.04] px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </span>
          {screen.linkLabel && (
            <span className="mx-auto truncate rounded-full bg-black/30 px-3 py-0.5 font-mono text-[0.65rem] text-[var(--cs-muted)]">
              {screen.linkLabel}
            </span>
          )}
          <span className="w-8" aria-hidden />
        </div>
        <div style={{ backgroundColor: "var(--cs-card)" }}>{screen.mock}</div>
      </div>
    );
  }

  if (screen.slug && screen.imageSrc) {
    return (
      <ProjectBrowserPreview
        slug={`${screen.slug}-use`}
        imageSrc={screen.imageSrc}
        imageAlt={screen.imageAlt}
        linkLabel={screen.linkLabel}
        className="rounded-2xl"
      />
    );
  }

  if (screen.imageSrc) {
    return (
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.04] px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </span>
          {screen.linkLabel && (
            <span className="mx-auto truncate rounded-full bg-black/30 px-3 py-0.5 font-mono text-[0.65rem] text-[var(--cs-muted)]">
              {screen.linkLabel}
            </span>
          )}
          <span className="w-8" aria-hidden />
        </div>
        <Image
          src={screen.imageSrc}
          alt={screen.imageAlt}
          width={700}
          height={438}
          className="w-full"
        />
      </div>
    );
  }

  return null;
}

export default function UseCaseScreenGrid({ screens }: UseCaseScreenGridProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {screens.map((screen) => (
        <figure key={screen.caption} className="space-y-3">
          <ScreenFrame screen={screen} />
          <figcaption className="text-sm leading-relaxed text-[var(--cs-muted)]">
            {screen.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
