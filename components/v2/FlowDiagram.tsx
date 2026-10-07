"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/i18n";
import { EASE } from "@/components/v2/Primitives";
import type { FlowNode } from "@/lib/work";
import type { L } from "@/lib/i18n";

/**
 * A pipeline drawn as a vertical chain of stages. The steps reveal one after
 * another as the card scrolls into view, then a pulse keeps travelling down
 * each connector — the "data is moving" cue that a static screenshot cannot
 * give. Everything is plain markup, so it costs no image weight.
 */
export default function FlowDiagram({
  title,
  nodes,
  badge,
  accent,
}: {
  title: L;
  nodes: FlowNode[];
  badge?: L;
  accent: string;
}) {
  const { t } = useLocale();
  const reduce = useReducedMotion();

  return (
    <div
      className="flex min-h-[240px] flex-col rounded-[24px] border bg-black/25 p-5 sm:rounded-[32px] sm:p-7 md:min-h-[300px] md:rounded-[40px]"
      style={{ borderColor: `color-mix(in srgb, ${accent} 28%, transparent)` }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
          {t(title)}
        </p>
        {badge && (
          <span
            className="inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em]"
            style={{
              color: accent,
              borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
              background: `color-mix(in srgb, ${accent} 10%, transparent)`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full motion-safe:animate-pulse"
              style={{ background: accent }}
            />
            {t(badge)}
          </span>
        )}
      </div>

      <ol className="flex flex-1 flex-col justify-center">
        {nodes.map((node, i) => {
          const last = i === nodes.length - 1;
          return (
            <li key={node.label.en} className="relative flex gap-4">
              {/* Rail: the step marker and the connector to the next stage. */}
              <div className="flex w-6 shrink-0 flex-col items-center">
                <motion.span
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.18, ease: EASE }}
                  className="mt-3 flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[0.65rem]"
                  style={{
                    color: last ? "#0C0A16" : accent,
                    background: last ? accent : "transparent",
                    borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
                  }}
                >
                  {i + 1}
                </motion.span>
                {!last && (
                  <span className="relative my-1 w-px flex-1 overflow-hidden bg-white/[0.1]">
                    <span
                      aria-hidden
                      className="flow-pulse absolute left-0 top-0 h-3 w-px"
                      style={{
                        background: `linear-gradient(to bottom, transparent, ${accent})`,
                        animationDelay: `${i * 0.55}s`,
                      }}
                    />
                  </span>
                )}
              </div>

              <motion.div
                initial={reduce ? false : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.18, ease: EASE }}
                className="mb-2 min-w-0 flex-1 rounded-2xl border px-4 py-2.5"
                style={{
                  borderColor: last
                    ? `color-mix(in srgb, ${accent} 45%, transparent)`
                    : "rgba(255,255,255,0.09)",
                  background: last
                    ? `color-mix(in srgb, ${accent} 10%, rgba(0,0,0,0.3))`
                    : "rgba(0,0,0,0.3)",
                }}
              >
                <p className="text-sm font-medium text-white">{t(node.label)}</p>
                {node.sub && (
                  <p className="mt-0.5 text-xs text-muted">{t(node.sub)}</p>
                )}
                {node.chips && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {node.chips.map((chip) => (
                      <li
                        key={chip.en}
                        className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[0.68rem] text-[#C9C4DC]"
                      >
                        {t(chip)}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
