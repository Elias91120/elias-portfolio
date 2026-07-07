import { contact } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-5">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <span>
          © {new Date().getFullYear()}{" "}
          Elias Elloumi — crafted with Next.js, GSAP &amp; a bit of Minecraft
          nostalgia.
        </span>
        <div className="flex items-center gap-5">
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
