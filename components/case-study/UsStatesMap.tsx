const HIGHLIGHTED = [
  { id: "CA", label: "CA", cx: 72, cy: 168 },
  { id: "TX", label: "TX", cx: 318, cy: 248 },
  { id: "FL", label: "FL", cx: 468, cy: 278 },
  { id: "NY", label: "NY", cx: 498, cy: 118 },
];

export default function UsStatesMap({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-[0.18] ${className}`.trim()}
      aria-hidden
    >
      <svg
        viewBox="0 0 560 320"
        className="absolute -right-8 top-16 h-auto w-[min(72%,28rem)]"
        fill="none"
      >
        <path
          d="M48 72 L88 48 L148 56 L188 40 L228 52 L268 44 L308 56 L348 48 L388 60 L428 52 L468 64 L508 56 L528 72 L520 96 L512 120 L504 144 L496 168 L488 192 L480 216 L472 240 L464 264 L456 280 L448 288 L440 292 L432 288 L424 280 L416 272 L408 264 L400 256 L392 248 L384 240 L376 232 L368 224 L360 216 L352 208 L344 200 L336 192 L328 184 L320 176 L312 168 L304 160 L296 152 L288 144 L280 136 L272 128 L264 120 L256 112 L248 104 L240 96 L232 88 L224 80 L216 72 L208 64 L200 56 L192 48 L184 40 L176 32 L168 24 L160 16 L152 8 L144 0 L136 8 L128 16 L120 24 L112 32 L104 40 L96 48 L88 56 L80 64 L72 72 L64 80 L56 88 L48 96 L40 104 L32 112 L24 120 L16 128 L8 136 L0 144 L8 152 L16 160 L24 168 L32 176 L40 184 L48 192 L56 200 L64 208 L72 216 L80 224 L88 232 L96 240 L104 248 L112 256 L120 264 L128 272 L136 280 L144 288 L152 296 L160 304 L168 312 L176 320 L184 312 L192 304 L200 296 L208 288 L216 280 L224 272 L232 264 L240 256 L248 248 L256 240 L264 232 L272 224 L280 216 L288 208 L296 200 L304 192 L312 184 L320 176 L328 168 L336 160 L344 152 L352 144 L360 136 L368 128 L376 120 L384 112 L392 104 L400 96 L408 88 L416 80 L424 72 L432 64 L440 56 L448 48 L456 40 L464 32 L472 24 L480 16 L488 8 L496 0 L504 8 L512 16 L520 24 L528 32 L536 40 L544 48 L552 56 L560 64 L552 72 L544 80 L536 88 L528 96 L520 104 L512 112 L504 120 L496 128 L488 136 L480 144 L472 152 L464 160 L456 168 L448 176 L440 184 L432 192 L424 200 L416 208 L408 216 L400 224 L392 232 L384 240 L376 248 L368 256 L360 264 L352 272 L344 280 L336 288 L328 296 L320 304 L312 312 L304 320 L296 312 L288 304 L280 296 L272 288 L264 280 L256 272 L248 264 L240 256 L232 248 L224 240 L216 232 L208 224 L200 216 L192 208 L184 200 L176 192 L168 184 L160 176 L152 168 L144 160 L136 152 L128 144 L120 136 L112 128 L104 120 L96 112 L88 104 L80 96 L72 88 L64 80 L56 72 L48 64 Z"
          className="hidden"
        />
        {/* Simplified continental US silhouette */}
        <path
          d="M72 88 C120 52 200 48 280 56 C360 64 440 72 500 96 C520 120 508 160 480 200 C440 248 360 280 280 288 C200 296 120 272 72 240 C48 200 52 140 72 88 Z"
          fill="var(--cs-accent)"
          fillOpacity="0.08"
          stroke="var(--cs-accent)"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />
        <path
          d="M500 96 C512 108 520 128 516 148 C508 168 492 180 476 172 C468 160 472 132 488 108 C492 100 496 96 500 96 Z"
          fill="var(--cs-accent)"
          fillOpacity="0.06"
          stroke="var(--cs-accent)"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        {HIGHLIGHTED.map((state) => (
          <g key={state.id}>
            <circle
              cx={state.cx}
              cy={state.cy}
              r="14"
              fill="var(--cs-accent)"
              fillOpacity="0.15"
            />
            <circle
              cx={state.cx}
              cy={state.cy}
              r="5"
              fill="var(--cs-gold)"
              fillOpacity="0.9"
            />
            <text
              x={state.cx}
              y={state.cy - 18}
              textAnchor="middle"
              className="fill-[var(--cs-accent)] text-[10px] font-semibold"
              opacity="0.7"
            >
              {state.label}
            </text>
          </g>
        ))}
      </svg>
      <p
        className="absolute bottom-8 right-6 text-[0.65rem] font-medium uppercase tracking-[0.2em]"
        style={{ color: "var(--cs-muted)" }}
      >
        Multi-state coverage
      </p>
    </div>
  );
}
