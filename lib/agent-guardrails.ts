import { contact, projects } from "@/lib/data";

const PORTFOLIO_URL = "https://elias-elloumi.com";
const ALLOWED_EMAIL = contact.email.toLowerCase();

/** Hostnames the assistant may mention (built from site data). */
function buildAllowedHosts(): Set<string> {
  const hosts = new Set([
    "elias-elloumi.com",
    "www.elias-elloumi.com",
    "3geeks.fr",
    "www.3geeks.fr",
    "prompt-hub.3geeks.fr",
    "linkedin.com",
    "www.linkedin.com",
    "fiverr.com",
    "www.fiverr.com",
    "apps.apple.com",
  ]);

  for (const project of projects) {
    if (!project.link) continue;
    try {
      hosts.add(new URL(project.link).hostname.replace(/^www\./, ""));
      hosts.add(new URL(project.link).hostname);
    } catch {
      /* ignore malformed links */
    }
  }

  return hosts;
}

const ALLOWED_HOSTS = buildAllowedHosts();

/** Patterns that indicate a hallucinated or unsafe assistant reply. */
const UNTRUSTWORTHY_PATTERNS = [
  /webgen\.com/i,
  /outellier/i,
  /michel[- ]?elloumi/i,
  /\[\s*at\s*\]/i,
  /correspondance personnelle/i,
  /offres alternatives/i,
  /nom de domaine incorrect/i,
  /temps partiel/i,
  /part[- ]time (?:job|employment|position)/i,
  /emploi d['']entreprise/i,
];

const URL_PATTERN = /https?:\/\/[^\s)\]>,"']+/gi;
const EMAIL_PATTERN = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi;

function hostAllowed(rawUrl: string): boolean {
  try {
    const host = new URL(rawUrl).hostname.replace(/^www\./, "");
    return ALLOWED_HOSTS.has(host) || ALLOWED_HOSTS.has(`www.${host}`);
  } catch {
    return false;
  }
}

function detectLanguageHint(text: string): "fr" | "en" {
  return /[àâäéèêëïîôùûüç]|alternance|disponib|bonjour|merci|est-il|recherche/i.test(
    text,
  )
    ? "fr"
    : "en";
}

export function buildSafeFallback(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  const lang = detectLanguageHint(userMessage);

  if (
    /alternance|apprenticeship|disponib|available|recrut|hire|emploi|job|work[- ]study/.test(
      msg,
    )
  ) {
    return lang === "fr"
      ? `Oui — Elias recherche activement une alternance de deux ans (2026–2028) en data engineering / IA, en parallèle de son M.Sc. Data Engineering & AI à EFREI Paris (RNCP niveau 7). Il reste aussi ouvert au freelance via webgen. Contact : ${contact.email}`
      : `Yes — Elias is actively looking for a two-year apprenticeship (2026–2028) in data engineering / AI, alongside his M.Sc. at EFREI Paris (RNCP level 7). Freelance via webgen is also open. Contact: ${contact.email}`;
  }

  if (/contact|email|reach|joindre|linkedin|fiverr/.test(msg)) {
    return lang === "fr"
      ? `Contact Elias : ${contact.email} · LinkedIn ${contact.linkedinLabel} · Portfolio ${PORTFOLIO_URL}`
      : `Reach Elias at ${contact.email} · LinkedIn ${contact.linkedinLabel} · Portfolio ${PORTFOLIO_URL}`;
  }

  return lang === "fr"
    ? `Je n'ai pas cette information avec certitude. Pour une question précise, contactez Elias : ${contact.email}`
    : `I'm not certain about that detail. For a precise answer, email Elias at ${contact.email}`;
}

export function isResponseUntrustworthy(text: string): boolean {
  if (!text.trim()) return true;
  if (UNTRUSTWORTHY_PATTERNS.some((re) => re.test(text))) return true;

  const emails = text.match(EMAIL_PATTERN) ?? [];
  if (emails.some((e) => e.toLowerCase() !== ALLOWED_EMAIL)) return true;

  const urls = text.match(URL_PATTERN) ?? [];
  if (urls.some((u) => !hostAllowed(u))) return true;

  return false;
}

/** Strip or fix URLs and emails that are not on the allowlist. */
export function sanitizeAssistantResponse(text: string): string {
  let out = text;

  out = out.replace(EMAIL_PATTERN, (email) =>
    email.toLowerCase() === ALLOWED_EMAIL ? email : contact.email,
  );

  out = out.replace(URL_PATTERN, (url) =>
    hostAllowed(url) ? url : PORTFOLIO_URL,
  );

  return out.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

/**
 * Final pass before showing a reply. Replaces the whole message if still unsafe.
 */
export function finalizeAssistantResponse(
  raw: string,
  userMessage: string,
): string {
  const cleaned = sanitizeAssistantResponse(raw);
  if (isResponseUntrustworthy(cleaned)) {
    return buildSafeFallback(userMessage);
  }
  return cleaned;
}
