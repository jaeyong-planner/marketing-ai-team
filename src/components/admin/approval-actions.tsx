"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ApprovalActionsProps = {
  contentId: string;
};

export function ApprovalActions({ contentId }: ApprovalActionsProps) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function decide(action: "approved" | "rejected" | "needs_revision") {
    setLoading(true);
    const response = await fetch(`/api/content/${contentId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, comment: comment || undefined }),
    });
    setLoading(false);

    if (response.ok) {
      setComment("");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="코멘트 (선택)"
        className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm outline-none focus:border-cyan-400"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => decide("approved")}
          className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          승인
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => decide("needs_revision")}
          className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-60"
        >
          수정 요청
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => decide("rejected")}
          className="rounded bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
        >
          거절
        </button>
      </div>
    </div>
  );
}