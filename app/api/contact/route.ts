import { NextRequest, NextResponse } from "next/server";
import { notifyLead } from "@/lib/lead";

export const runtime = "edge";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim().slice(0, 120);
  const email = String(body?.email ?? "").trim().slice(0, 200);
  const message = String(body?.message ?? "").trim().slice(0, 4000);
  // Hidden field only bots fill in — pretend it went through.
  if (body?.company) return NextResponse.json({ ok: true });

  if (!EMAIL.test(email) || !message) {
    return NextResponse.json({ ok: false, error: "Add a valid email and a message." }, { status: 400 });
  }

  const ok = await notifyLead({ name, email, note: message }, "contact");
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "The relay dropped it. Email patharia52@gmail.com directly." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
