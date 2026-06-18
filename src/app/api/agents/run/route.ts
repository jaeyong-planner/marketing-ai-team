import { NextResponse } from "next/server";
import { runAgentCycle } from "@/lib/agents/pipeline";
import { requireAdminUser } from "@/lib/auth/admin";

export async function POST(request: Request) {
  const { user, error } = await requireAdminUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { topic?: string };
  try {
    body = (await request.json()) as { topic?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.topic?.trim()) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  try {
    const result = await runAgentCycle(body.topic);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pipeline failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}