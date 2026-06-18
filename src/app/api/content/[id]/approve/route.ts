import { NextResponse } from "next/server";
import { decideApproval } from "@/lib/agents/approval";
import { requireAdminUser } from "@/lib/auth/admin";
import type { ApprovalStatus } from "@/types/database";

type RouteContext = { params: Promise<{ id: string }> };

const ACTIONS: ApprovalStatus[] = [
  "approved",
  "rejected",
  "needs_revision",
];

export async function POST(request: Request, context: RouteContext) {
  const { user, error, supabase } = await requireAdminUser();
  if (error || !user || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { action?: string; comment?: string };
  try {
    body = (await request.json()) as { action?: string; comment?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.action || !ACTIONS.includes(body.action as ApprovalStatus)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const result = await decideApproval(
      supabase,
      id,
      user.id,
      body.action as Exclude<ApprovalStatus, "pending">,
      body.comment,
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Approval failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}