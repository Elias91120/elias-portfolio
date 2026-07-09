export default function NokiaGridDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      aria-hidden
      style={{
        backgroundImage: `
          linear-gradient(var(--cs-accent) 1px, transparent 1px),
          linear-gradient(90deg, var(--cs-accent) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    />
  );
}
