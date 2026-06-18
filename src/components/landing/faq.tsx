const FAQ_ITEMS = [
  {
    q: "AI가 콘텐츠를 바로 배포하나요?",
    a: "아닙니다. 모든 콘텐츠는 승인 게이트를 통과해야 배포됩니다. 인간은 승인만 하면 됩니다.",
  },
  {
    q: "어떤 채널을 지원하나요?",
    a: "블로그, 소셜, 이메일, 스크립트 등 마케팅 에셋을 생성하고 채널별 포맷으로 변환합니다.",
  },
  {
    q: "Supabase는 어떻게 쓰이나요?",
    a: "리드 CRM, 콘텐츠 캘린더, 승인 기록, 분석 이벤트를 한 DB에서 관리합니다.",
  },
  {
    q: "24시간 운영은 어떻게 되나요?",
    a: "VPS에서 Hermes/Langflow 에이전트가 스케줄에 따라 연구·작성을 반복 실행합니다.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-zinc-800/80 py-20">
      <h2 className="mb-10 text-2xl font-bold tracking-tight md:text-3xl">
        자주 묻는 질문
      </h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-medium text-zinc-100 marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-cyan-400 transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}