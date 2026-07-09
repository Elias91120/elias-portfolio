import { Mistral } from "@mistralai/mistralai";
import { buildSystemPrompt } from "@/lib/agent-context";

export const runtime = "nodejs";

const MODEL = "mistral-small-latest";
const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 2000;

type IncomingMessage = { role: "user" | "assistant"; content: string };

function textFromDelta(content: unknown): string {
  if (typeof content === "string") return content;
  return "";
}

function sanitizeMessages(raw: unknown): IncomingMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw.slice(-MAX_MESSAGES).map((m) => {
    if (
      typeof m !== "object" ||
      m === null ||
      ((m as IncomingMessage).role !== "user" &&
        (m as IncomingMessage).role !== "assistant") ||
      typeof (m as IncomingMessage).content !== "string"
    ) {
      return null;
    }
    return {
      role: (m as IncomingMessage).role,
      content: (m as IncomingMessage).content.slice(0, MAX_MESSAGE_LENGTH),
    };
  });
  if (messages.some((m) => m === null)) return null;
  if (messages[0]!.role !== "user") return null;
  return messages as IncomingMessage[];
}

export async function POST(req: Request) {
  if (!process.env.MISTRAL_API_KEY) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }

  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.chat.stream({
          model: MODEL,
          maxTokens: 800,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...messages,
          ],
        });

        for await (const event of stream) {
          const text = textFromDelta(event.data?.choices?.[0]?.delta?.content);
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
