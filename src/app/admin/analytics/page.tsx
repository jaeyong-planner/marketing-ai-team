import { fetchKpiSnapshot } from "@/lib/kpi/metrics";

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export default async function AdminAnalyticsPage() {
  const kpi = await fetchKpiSnapshot();

  return (
    <main>
      <h1 className="mb-2 text-2xl font-bold">KPI & A/B</h1>
      <p className="mb-8 text-sm text-zinc-500">
        리드 · 방문 · 발행 · 승인율 · Hero A/B 실험
      </p>

      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "전체 리드", value: kpi.leadsTotal },
          { label: "7일 리드", value: kpi.leadsWeek },
          { label: "페이지뷰", value: kpi.pageViews },
          { label: "발행 포스트", value: kpi.publishedCount },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <p className="text-sm text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="font-semibold">승인 게이트</h2>
          <p className="mt-4 text-4xl font-bold text-amber-400">
            {pct(kpi.approvalRate)}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            승인 대기 {kpi.pendingReview}건
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="font-semibold">CPA 추정</h2>
          <p className="mt-4 text-4xl font-bold text-emerald-400">
            {kpi.leadsTotal > 0 ? `₩${Math.round(50000 / kpi.leadsTotal).toLocaleString()}` : "—"}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            테스트 예산 ₩50,000 / 리드 (Meta seed 캠페인 기준)
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-4 font-semibold">Hero A/B — hero_headline_v1</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-3 pr-4">Variant</th>
                <th className="pb-3 pr-4">Views</th>
                <th className="pb-3 pr-4">CTA Clicks</th>
                <th className="pb-3 pr-4">Leads</th>
                <th className="pb-3">CTR</th>
              </tr>
            </thead>
            <tbody>
              {kpi.abVariants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-zinc-500">
                    아직 A/B 이벤트 없음 — 랜딩 방문 후 갱신
                  </td>
                </tr>
              ) : (
                kpi.abVariants.map((row) => (
                  <tr key={row.variant} className="border-t border-zinc-800">
                    <td className="py-3 pr-4 font-medium">{row.variant}</td>
                    <td className="py-3 pr-4">{row.views}</td>
                    <td className="py-3 pr-4">{row.ctaClicks}</td>
                    <td className="py-3 pr-4">{row.leads}</td>
                    <td className="py-3">
                      {row.views > 0 ? pct(row.ctaClicks / row.views) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}