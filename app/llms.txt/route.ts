import { NextResponse } from "next/server";
import { SITE_CONTEXT } from "@/lib/ai-context";

export async function GET() {
  return new NextResponse(SITE_CONTEXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
