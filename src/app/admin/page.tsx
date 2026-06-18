import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RunPipelineForm } from "@/components/admin/run-pipeline-form";
import type { Profile } from "@/types/database";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .maybeSingle();

  const profile = profileRow as Pick<
    Profile,
    "full_name" | "role" | "email"
  > | null;

  const { count: leadCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  const { count: pendingCount } = await supabase
    .from("content_calendar")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_review");

  return (
    <main>
      <p className="mb-2 text-sm font-medium tracking-wide text-cyan-400 uppercase">
        Dashboard
      </p>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        안녕하세요, {profile?.full_name ?? user?.email}
      </h1>
      <p className="mb-10 text-zinc-400">
        역할: {profile?.role ?? "admin"}
      </p>

      <section className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-4 font-semibold">에이전트 파이프라인</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Researcher → Writer → 승인 대기 (pending_review)
        </p>
        <RunPipelineForm />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/leads"
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-cyan-500/40"
        >
          <h2 className="font-semibold">리드</h2>
          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {leadCount ?? 0}
          </p>
          <p className="mt-1 text-sm text-zinc-500">전체 수집 리드</p>
        </Link>
        <Link
          href="/admin/content"
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-cyan-500/40"
        >
          <h2 className="font-semibold">콘텐츠</h2>
          <p className="mt-2 text-sm text-zinc-500">캘린더 · 발행 관리</p>
        </Link>
        <Link
          href="/admin/approvals"
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-amber-500/40"
        >
          <h2 className="font-semibold">승인 대기</h2>
          <p className="mt-2 text-3xl font-bold text-amber-400">
            {pendingCount ?? 0}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Human Approval Gate</p>
        </Link>
      </section>

      <Link
        href="/"
        className="mt-10 inline-block text-sm text-cyan-400 hover:text-cyan-300"
      >
        ← 랜딩 페이지로
      </Link>
    </main>
  );
}