import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApprovalStatus, ContentStatus } from "@/types/database";

export type ApprovalAction = ApprovalStatus;

const STATUS_MAP: Record<ApprovalAction, ContentStatus> = {
  pending: "pending_review",
  approved: "approved",
  rejected: "rejected",
  needs_revision: "needs_revision",
};

export async function decideApproval(
  supabase: SupabaseClient,
  contentId: string,
  reviewerId: string,
  action: Exclude<ApprovalAction, "pending">,
  comment?: string,
) {
  const contentStatus = STATUS_MAP[action];

  const { data: content, error: contentError } = await supabase
    .from("content_calendar")
    .select("id, status")
    .eq("id", contentId)
    .single();

  if (contentError || !content) {
    throw new Error("Content not found");
  }

  if (content.status !== "pending_review") {
    throw new Error(`Cannot approve: content status is ${content.status}`);
  }

  const { error: approvalError } = await supabase.from("approvals").insert({
    content_id: contentId,
    status: action,
    reviewer_id: reviewerId,
    comment: comment ?? null,
    decided_at: new Date().toISOString(),
  });

  if (approvalError) {
    throw new Error(approvalError.message);
  }

  const { error: updateError } = await supabase
    .from("content_calendar")
    .update({ status: contentStatus })
    .eq("id", contentId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { contentId, status: contentStatus };
}