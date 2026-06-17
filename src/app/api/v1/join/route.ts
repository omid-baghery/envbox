import { NextRequest, NextResponse } from "next/server";
import { joinWithToken } from "@/features/members/members.actions";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = body?.token as string | undefined;

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  try {
    const { apiKey } = await joinWithToken(token);
    return NextResponse.json({ apiKey });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to join";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
