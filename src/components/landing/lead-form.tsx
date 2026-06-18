"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { pushDataLayer, trackMeta, trackServer } from "@/lib/analytics/events";

export function LeadForm() {
  const searchParams = useSearchParams();
  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      utm_content: searchParams.get("utm_content") ?? undefined,
      utm_term: searchParams.get("utm_term") ?? undefined,
    }),
    [searchParams],
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, interest, website: "", ...utm }),
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "제출에 실패했습니다.");
      return;
    }

    setStatus("success");
    setMessage("신청이 완료되었습니다. 곧 연락드리겠습니다.");
    const abMatch = document.cookie.match(/ab_hero_variant=([ab])/);
    const variant = abMatch?.[1];
    pushDataLayer("lead_submit", { utm_campaign: utm.utm_campaign, variant });
    trackMeta("lead_submit", { content_name: "demo_request" });
    void trackServer("lead_submit", { source: "landing", variant, ...utm });
    setName("");
    setEmail("");
    setInterest("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">이름</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 outline-none focus:border-cyan-400"
            placeholder="홍길동"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">이메일</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 outline-none focus:border-cyan-400"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm text-zinc-400">
          관심 분야 (선택)
        </span>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option value="">선택하세요</option>
          <option value="demo">데모 상담</option>
          <option value="pilot">파일럿 도입</option>
          <option value="partnership">제휴 문의</option>
        </select>
      </label>
      {message ? (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            status === "success"
              ? "bg-cyan-500/10 text-cyan-200"
              : "bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:opacity-60"
      >
        {status === "loading" ? "제출 중..." : "데모 요청하기"}
      </button>
    </form>
  );
}