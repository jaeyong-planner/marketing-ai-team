import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const leads = (rows ?? []) as Lead[];

  return (
    <main>
      <h1 className="mb-2 text-2xl font-bold">리드 목록</h1>
      <p className="mb-8 text-sm text-zinc-500">
        최근 100건 · 실시간 갱신은 새로고침
      </p>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-red-300">
          {error.message}
        </p>
      ) : leads.length === 0 ? (
        <p className="text-zinc-500">아직 리드가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">이메일</th>
                <th className="px-4 py-3 font-medium">이름</th>
                <th className="px-4 py-3 font-medium">관심</th>
                <th className="px-4 py-3 font-medium">UTM</th>
                <th className="px-4 py-3 font-medium">일시</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-zinc-800/80 last:border-0"
                >
                  <td className="px-4 py-3 text-zinc-100">{lead.email}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {lead.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {lead.interest ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {[lead.utm_source, lead.utm_campaign]
                      .filter(Boolean)
                      .join(" / ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}