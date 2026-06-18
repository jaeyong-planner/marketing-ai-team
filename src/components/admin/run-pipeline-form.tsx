"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RunPipelineForm() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/agents/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const payload = (await response.json()) as {
      error?: string;
      title?: string;
    };

    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "실행 실패");
      return;
    }

    setMessage(`생성됨: ${payload.title}`);
    setTopic("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="콘텐츠 주제 입력"
        required
        className="min-w-[240px] flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm outline-none focus:border-cyan-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
      >
        {loading ? "실행 중..." : "에이전트 실행"}
      </button>
      {message ? (
        <p className="w-full text-sm text-cyan-200">{message}</p>
      ) : null}
    </form>
  );
}