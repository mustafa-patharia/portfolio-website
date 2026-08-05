import { NextRequest, NextResponse } from "next/server";
import { SITE_CONTEXT } from "@/lib/ai-context";

export const runtime = "edge";

const MODEL = "llama-3.3-70b-versatile";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured yet." },
      { status: 503 }
    );
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `${SITE_CONTEXT}\n\nRespond ONLY with JSON: {"reply": string, "suggestions": string[]}` },
        ...messages.map((m) => ({
          role: m.role === "model" ? "assistant" : "user",
          content: m.text,
        })),
      ],
    }),
  });

  if (!res.ok) {
    const error =
      res.status === 429
        ? "I've hit my chat limit for today — try again later, or use the contact section to reach me directly."
        : "Failed to reach the chat model.";
    return NextResponse.json({ error }, { status: 502 });
  }

  const data = await res.json();
  const raw: string = data?.choices?.[0]?.message?.content ?? "";

  let reply = "Sorry, I couldn't come up with a reply to that — try asking something else.";
  let suggestions: string[] = [];
  try {
    const parsed = JSON.parse(raw);
    reply = parsed.reply ?? reply;
    suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [];
  } catch {
    if (raw) reply = raw;
  }

  return NextResponse.json({ reply, suggestions });
}
