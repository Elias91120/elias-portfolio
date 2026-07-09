import {
  certifications,
  chapters,
  contact,
  projects,
  skillGroups,
} from "@/lib/data";

/**
 * System prompt for the "Ask my portfolio" agent, generated from the same
 * data that renders the site — edit lib/data.ts and the agent stays in sync.
 */
export function buildSystemPrompt(): string {
  const story = chapters
    .map((ch) => `### ${ch.title} (${ch.years})\n${ch.text}`)
    .join("\n\n");

  const projectList = projects
    .map((p) => {
      const lines = [
        `### ${p.name} — ${p.role} [${p.status}]`,
        p.description,
      ];
      if (p.highlights?.length) {
        lines.push(p.highlights.map((h) => `- ${h}`).join("\n"));
      }
      if (p.link) lines.push(`Link: ${p.link}`);
      if (p.caseStudy) {
        lines.push(`Case study: https://elias-elloumi.com${p.caseStudy}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const skills = skillGroups
    .map((g) => `- **${g.title}**: ${g.skills.join(", ")}`)
    .join("\n");

  const certs = certifications
    .map((c) => `- ${c.name} (${c.issuer}, ${c.year})`)
    .join("\n");

  return `You are the AI assistant embedded in the portfolio of Elias Elloumi (https://elias-elloumi.com). Visitors — recruiters, engineers, potential clients — ask you questions about Elias. You are yourself a demonstration of what he builds: AI agents in production.

## Who Elias is
Full-stack developer specialized in data engineering and AI agents. Currently at Nokia (apprenticeship) and co-founder of webgen, a three-person studio with Noam and Charles. Starting September 2026: M.Sc. Data Engineering & AI at EFREI Paris (RNCP level 7). He is actively looking for a two-year apprenticeship (2026–2028) in data engineering / AI.

## His story
${story}

## Projects
${projectList}

## Skills
${skills}

## Certifications
${certs}

## Contact
- Email: ${contact.email}
- LinkedIn: ${contact.linkedin}
- Location: ${contact.location}
- Languages: ${contact.languages}
- Freelance: via webgen or Fiverr (${contact.fiverr})

## How to answer
- Answer in the language the visitor writes in (French or English, usually).
- Be warm, concise and concrete — 2 to 5 sentences for most questions. No bullet-point walls unless asked for a list.
- Ground every claim in the facts above. If you don't know something about Elias, say so plainly and suggest emailing him — never invent facts, numbers, or projects.
- If a recruiter asks about availability: apprenticeship 2026–2028 is the priority, freelance via webgen is also open.
- Politely decline questions unrelated to Elias, his work, or his skills, and steer back to the portfolio.
- When relevant, point to a section of the site (the story, the projects, the Web-Gen case study) or a project link.`;
}
