import { NextResponse } from "next/server";
import { publishContent } from "@/lib/agents/publisher";
import { requireAdminUser } from "@/lib/auth/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { user, error } = await requireAdminUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const result = await publishContent(id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Publish failed";
    const status = message.includes("blocked") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}