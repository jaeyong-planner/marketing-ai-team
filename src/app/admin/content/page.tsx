import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublishButton } from "@/components/admin/publish-button";
import type { ContentCalendar } from "@/types/database";

const STATUS_LABEL: Record<string, string> = {
  pending_review: "승인 대기",
  approved: "승인됨",
  published: "발행됨",
  rejected: "거절",
  needs_revision: "수정 요청",
  draft: "초안",
};

export default async function AdminContentPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("content_calendar")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (rows ?? []) as ContentCalendar[];

  return (
    <main>
      <h1 className="mb-2 text-2xl font-bold">콘텐츠 캘린더</h1>
      <p className="mb-8 text-sm text-zinc-500">최근 50건</p>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
            <tr>
              <th className="px-4 py-3">제목</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">유형</th>
              <th className="px-4 py-3">생성</th>
              <th className="px-4 py-3">액션</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-zinc-800/80 last:border-0"
              >
                <td className="px-4 py-3 text-zinc-100">{item.title}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{item.type}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(item.created_at).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  {item.status === "pending_review" ? (
                    <Link
                      href="/admin/approvals"
                      className="text-cyan-400 hover:underline"
                    >
                      승인하기
                    </Link>
                  ) : item.status === "approved" ? (
                    <PublishButton contentId={item.id} />
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}