import { buildSystemPrompt } from "@/lib/agent-context";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const API_URL = "https://api.3geeks.fr/v1/chat/completions";
const MAX_MESSAGES = 6;
const MAX_MESSAGE_LENGTH = 800;
const MAX_TOKENS = 280;

type IncomingMessage = { role: "user" | "assistant"; content: string };

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

function textFromSseChunk(payload: string): string {
  const trimmed = payload.trim();
  if (!trimmed.startsWith("data:")) return "";
  const data = trimmed.slice(5).trim();
  if (!data || data === "[DONE]") return "";

  try {
    const parsed = JSON.parse(data) as {
      choices?: Array<{ delta?: { content?: unknown } }>;
    };
    const content = parsed.choices?.[0]?.delta?.content;
    return typeof content === "string" ? content : "";
  } catch {
    return "";
  }
}

async function streamFromThreeGeeks(
  messages: IncomingMessage[],
  apiKey: string,
): Promise<Response> {
  const upstream = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stream: true,
      temperature: 0,
      max_tokens: MAX_TOKENS,
      ...(process.env.THREEGEEKS_MODEL
        ? { model: process.env.THREEGEEKS_MODEL }
        : {}),
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages,
      ],
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error("3geeks API error:", upstream.status, detail);
    return Response.json(
      { error: "The assistant is temporarily unavailable." },
      { status: 502 },
    );
  }

  if (!upstream.body) {
    return Response.json(
      { error: "The assistant returned an empty response." },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();
  let buffer = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const text = textFromSseChunk(line);
            if (text) controller.enqueue(encoder.encode(text));
          }
        }

        const trailing = textFromSseChunk(buffer);
        if (trailing) controller.enqueue(encoder.encode(trailing));
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
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.THREEGEEKS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 503 },
    );
  }

  const rateLimit = checkRateLimit(getClientIp(req));
  if (!rateLimit.success) {
    const retryAfter = Math.max(
      1,
      rateLimit.reset - Math.floor(Date.now() / 1000),
    );
    return Response.json(
      {
        error:
          "Too many messages — please wait a moment before asking again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": "0",
        },
      },
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

  return streamFromThreeGeeks(messages, apiKey);
}
