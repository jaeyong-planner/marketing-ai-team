"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PublishButton({ contentId }: { contentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    setLoading(true);
    await fetch(`/api/content/${contentId}/publish`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handlePublish}
      className="text-xs text-emerald-400 hover:underline disabled:opacity-50"
    >
      {loading ? "발행 중..." : "발행"}
    </button>
  );
}