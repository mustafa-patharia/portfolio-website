import { NextRequest, NextResponse } from "next/server";
import { SITE_CONTEXT } from "@/lib/ai-context";

export const runtime = "edge";

const MODEL = "openai/gpt-oss-120b";
const CAL_USERNAME = "mustafa-patharia";
const CAL_EVENT_SLUG = "quick-chat";
const CAL_TIMEZONE = "Asia/Dubai";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const stripHeaderInjection = (s: string) => s.replace(/[\r\n]+/g, " ");

async function notifyLead(lead: { name?: string; email?: string; phone?: string; note?: string }) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;
  const name = stripHeaderInjection(lead.name || "");
  const email = stripHeaderInjection(lead.email || "");
  const phone = stripHeaderInjection(lead.phone || "");
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "patharia52@gmail.com",
      subject: `New chat lead: ${name || email}`,
      html: `<p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Name:</strong> ${escapeHtml(name) || "—"}</p><p><strong>Phone:</strong> ${escapeHtml(phone) || "—"}</p><p><strong>Note:</strong> ${escapeHtml(lead.note || "") || "—"}</p>`,
    }),
  }).catch(() => {});
}

// ponytail: module-scope cache, lives only as long as the edge instance stays warm — fine, one lookup call is cheap either way
let cachedEventTypeId: number | null = null;

async function resolveEventTypeId(calKey: string): Promise<number> {
  if (cachedEventTypeId) return cachedEventTypeId;
  const res = await fetch(
    `https://api.cal.com/v2/event-types?username=${CAL_USERNAME}&eventSlug=${CAL_EVENT_SLUG}`,
    { headers: { Authorization: `Bearer ${calKey}`, "cal-api-version": "2024-06-14" } }
  );
  const json = await res.json();
  const id = json?.data?.[0]?.id;
  if (!id) throw new Error("Could not resolve Cal.com event type.");
  cachedEventTypeId = id;
  return id;
}

async function getAvailableSlots(calKey: string, daysAhead: number) {
  const eventTypeId = await resolveEventTypeId(calKey);
  const start = new Date();
  const end = new Date(Date.now() + Math.min(Math.max(daysAhead, 1), 14) * 86400000);
  const url = `https://api.cal.com/v2/slots?eventTypeId=${eventTypeId}&start=${start.toISOString()}&end=${end.toISOString()}&timeZone=${CAL_TIMEZONE}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${calKey}`, "cal-api-version": "2024-09-04" },
  });
  const json = await res.json();
  const byDate = json?.data ?? {};
  const slots = Object.values(byDate)
    .flat()
    .map((s: any) => s.start)
    .filter(Boolean)
    .slice(0, 8);
  return { timezone: CAL_TIMEZONE, slots };
}

async function bookMeeting(calKey: string, start: string, name: string, email: string, phone?: string) {
  const eventTypeId = await resolveEventTypeId(calKey);
  const res = await fetch("https://api.cal.com/v2/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${calKey}`,
      "cal-api-version": "2024-08-13",
    },
    body: JSON.stringify({
      start,
      eventTypeId,
      attendee: { name, email, timeZone: CAL_TIMEZONE, ...(phone ? { phoneNumber: phone } : {}) },
    }),
  });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: json?.error?.message || "Booking failed." };
  const uid = json?.data?.uid;
  return { ok: true, confirmationUrl: uid ? `https://cal.com/booking/${uid}` : null };
}

const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_available_slots",
      description: "Look up Mustafa's open meeting slots on Cal.com. Call this before offering times to the visitor.",
      parameters: {
        type: "object",
        properties: {
          days_ahead: { type: "string", description: "How many days from today to search, as a number e.g. \"5\". Default \"5\"." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_meeting",
      description:
        "Reserve a specific slot on Mustafa's Cal.com calendar. Only call this after the visitor has explicitly confirmed one exact time (from get_available_slots) and given their name and email.",
      parameters: {
        type: "object",
        properties: {
          start: { type: "string", description: "ISO 8601 start time, exactly as returned by get_available_slots." },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string", description: "Visitor's phone number, if they gave one." },
        },
        required: ["start", "name", "email"],
      },
    },
  },
];

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat is not configured yet." }, { status: 503 });
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const bookingIntent = /\b(book|call|meet|meeting|schedul|avail|slot|appointment)/i.test(
    messages
      .slice(-4)
      .map((m) => m.text)
      .join(" ")
  );
  const calKey = bookingIntent ? process.env.CAL_API_KEY : undefined;
  const convo: any[] = [
    {
      role: "system",
      content: `${SITE_CONTEXT}\n\nRespond ONLY with JSON: {"reply": string[], "lead": {"name": string, "email": string, "phone": string, "note": string} | null}. Use this JSON format for every normal reply — tool calls are a separate mechanism and don't need it.`,
    },
    ...messages.map((m) => ({ role: m.role === "model" ? "assistant" : "user", content: m.text })),
  ];

  let raw = "";
  let bookedLead: { name?: string; email?: string; phone?: string; note?: string } | null = null;

  const callGroq = (useTools: boolean) =>
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        temperature: 0.6,
        messages: convo,
        ...(useTools ? { tools: TOOLS } : { response_format: { type: "json_object" } }),
      }),
    });

  for (let round = 0; round < 4; round++) {
    let res = await callGroq(Boolean(calKey));

    if (!res.ok && calKey) {
      // gpt-oss on Groq occasionally tries to route its final answer through a fake "json" tool call
      // instead of plain content when tools are attached — retry once without tools to force plain JSON.
      const bodyText = await res.text();
      if (bodyText.includes("tool 'json'")) res = await callGroq(false);
      else {
        const error = res.status === 429
          ? "I've hit my chat limit for today — try again later, or use the contact section to reach me directly."
          : "Failed to reach the chat model.";
        return NextResponse.json({ error }, { status: 502 });
      }
    }

    if (!res.ok) {
      const error =
        res.status === 429
          ? "I've hit my chat limit for today — try again later, or use the contact section to reach me directly."
          : "Failed to reach the chat model.";
      return NextResponse.json({ error }, { status: 502 });
    }

    const data = await res.json();
    const message = data?.choices?.[0]?.message;
    const toolCalls = message?.tool_calls as
      | { id: string; function: { name: string; arguments: string } }[]
      | undefined;

    if (!toolCalls || toolCalls.length === 0 || !calKey) {
      raw = message?.content ?? "";
      break;
    }

    convo.push({ role: "assistant", content: message.content ?? null, tool_calls: toolCalls });
    for (const call of toolCalls) {
      let args: any = {};
      try {
        args = JSON.parse(call.function.arguments || "{}");
      } catch {}
      let result: unknown;
      try {
        if (call.function.name === "get_available_slots") {
          result = await getAvailableSlots(calKey, Number(args.days_ahead) || 5);
        } else if (call.function.name === "book_meeting") {
          result = await bookMeeting(calKey, args.start, args.name, args.email, args.phone);
          if ((result as any).ok)
            bookedLead = { name: args.name, email: args.email, phone: args.phone, note: "Booked a call via chat." };
        } else {
          result = { error: "Unknown tool." };
        }
      } catch (e) {
        result = { error: e instanceof Error ? e.message : "Tool call failed." };
      }
      convo.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }

  let reply: string[] = ["Sorry, I couldn't come up with a reply to that — try asking something else."];
  let lead: { name?: string; email?: string; phone?: string; note?: string } | null = bookedLead;
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.reply) && parsed.reply.length > 0) {
      reply = parsed.reply.filter((r: unknown) => typeof r === "string" && r.trim());
    } else if (typeof parsed.reply === "string" && parsed.reply.trim()) {
      reply = [parsed.reply];
    }
    if (!lead && parsed.lead && typeof parsed.lead.email === "string" && parsed.lead.email.trim()) {
      lead = parsed.lead;
    }
  } catch {
    if (raw) reply = [raw];
  }

  if (lead) await notifyLead(lead);

  return NextResponse.json({ reply });
}
