export default function InfraDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(var(--cs-accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--cs-accent) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-32 h-80 w-80 rounded-full opacity-15 blur-3xl"
        aria-hidden
        style={{
          background: "radial-gradient(circle, var(--cs-accent) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
