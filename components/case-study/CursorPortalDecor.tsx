export default function CursorPortalDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(var(--cs-accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--cs-accent) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        aria-hidden
        style={{
          background: "radial-gradient(circle, var(--cs-accent) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
