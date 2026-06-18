import { createClient } from "@/lib/supabase/server";
import { ApprovalActions } from "@/components/admin/approval-actions";
import type { ContentCalendar } from "@/types/database";

export default async function AdminApprovalsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("content_calendar")
    .select("*")
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });

  const items = (rows ?? []) as ContentCalendar[];

  return (
    <main>
      <h1 className="mb-2 text-2xl font-bold">승인 대기</h1>
      <p className="mb-8 text-sm text-zinc-500">
        pending_review 상태 콘텐츠 — 승인 전 publish 불가
      </p>

      {items.length === 0 ? (
        <p className="text-zinc-500">
          대기 중인 콘텐츠가 없습니다. 대시보드에서 에이전트를 실행하세요.
        </p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    주제: {item.topic ?? "—"} · {item.type}
                  </p>
                </div>
                <ApprovalActions contentId={item.id} />
              </div>
              {item.body_md ? (
                <pre className="max-h-48 overflow-auto rounded-lg bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-400 whitespace-pre-wrap">
                  {item.body_md.slice(0, 1200)}
                  {item.body_md.length > 1200 ? "\n…" : ""}
                </pre>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}