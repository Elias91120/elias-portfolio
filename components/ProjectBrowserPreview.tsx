import Image from "next/image";
import { ViewTransition } from "react";
import { projectPreviewName } from "@/lib/view-transitions";

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  Beta: "bg-violet-400/10 text-violet-300 ring-violet-400/30",
  "App Store": "bg-sky-400/10 text-sky-300 ring-sky-400/30",
  Award: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
  Internal: "bg-white/5 text-[#b8b3cf] ring-white/15",
};

type ProjectBrowserPreviewProps = {
  slug: string;
  imageSrc: string;
  imageAlt: string;
  linkLabel?: string;
  status?: string;
  priority?: boolean;
  className?: string;
  /** Card grid preview vs case-study hero — same chrome, different layout. */
  variant?: "card" | "case-study";
};

export default function ProjectBrowserPreview({
  slug,
  imageSrc,
  imageAlt,
  linkLabel,
  status,
  priority = false,
  className = "",
  variant = "case-study",
}: ProjectBrowserPreviewProps) {
  const isCard = variant === "card";

  const chrome = (
    <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.04] px-4 py-2.5">
      <span className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </span>
      {linkLabel && (
        <span
          className={`mx-auto flex min-w-0 items-center gap-1.5 rounded-full bg-black/30 px-3 py-0.5 font-mono text-[0.65rem] text-muted ${
            isCard ? "" : "truncate"
          }`}
        >
          {isCard && (
            <svg
              className="h-2.5 w-2.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
          <span className={isCard ? "truncate" : ""}>{linkLabel}</span>
        </span>
      )}
      <span className="w-8" aria-hidden />
    </div>
  );

  const imageBlock = isCard ? (
    <div className="relative aspect-[16/10] overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1024px) 24rem, (min-width: 768px) 45vw, 92vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.045]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-16"
        style={{
          background: "linear-gradient(to top, #120e20, transparent)",
        }}
      />
    </div>
  ) : (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={1400}
      height={875}
      className="w-full"
      priority={priority}
    />
  );

  const morphBlock = (
    <>
      {chrome}
      {imageBlock}
    </>
  );

  if (isCard) {
    return (
      <div className="relative">
        <ViewTransition name={projectPreviewName(slug)} share="morph">
          <div>{morphBlock}</div>
        </ViewTransition>
        {status && (
          <span
            className={`absolute right-3 top-[calc(2.5rem+0.75rem)] rounded-full px-3 py-1 text-xs font-medium ring-1 backdrop-blur-md ${
              statusStyles[status] ?? statusStyles.Internal
            }`}
          >
            {status}
          </span>
        )}
      </div>
    );
  }

  return (
    <ViewTransition name={projectPreviewName(slug)} share="morph">
      <div
        className={`overflow-hidden rounded-3xl ring-1 ring-white/12 ${className}`.trim()}
      >
        {morphBlock}
      </div>
    </ViewTransition>
  );
}
