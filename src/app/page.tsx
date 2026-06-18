import { Suspense } from "react";
import Link from "next/link";
import { LeadForm } from "@/components/landing/lead-form";
import { FaqSection } from "@/components/landing/faq";
import { HeroSection } from "@/components/landing/hero-section";

const STEPS = [
  { role: "Researcher", desc: "트렌드·키워드·경쟁사 리서치" },
  { role: "Writer", desc: "블로그·소셜·이메일 초안 생성" },
  { role: "Editor", desc: "톤·팩트·브랜드 가이드 검수" },
  { role: "You", desc: "승인 또는 수정 요청 (1클릭)" },
  { role: "Publisher", desc: "채널별 포맷 변환·배포 준비" },
] as const;

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,211,238,0.25), transparent)",
        }}
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          AI Marketing Team
        </span>
        <Link
          href="/login"
          className="text-sm text-zinc-400 transition hover:text-cyan-400"
        >
          관리자 로그인
        </Link>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-24">
        <HeroSection />

        <section
          id="how-it-works"
          className="border-t border-zinc-800/80 py-20"
        >
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
            How it works
          </h2>
          <p className="mb-12 max-w-2xl text-zinc-400">
            5단계 파이프라인. AI가 90%를 처리하고, 최종 승인만 사람이 합니다.
          </p>
          <ol className="grid gap-4 md:grid-cols-5">
            {STEPS.map((step, index) => (
              <li
                key={step.role}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <span className="text-xs font-medium text-cyan-400/80">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 font-semibold">{step.role}</h3>
                <p className="mt-2 text-sm text-zinc-500">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="waitlist"
          className="border-t border-zinc-800/80 py-20"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="font-[family-name:var(--font-display)] mb-4 text-2xl font-bold md:text-3xl">
                데모 & 파일럿 신청
              </h2>
              <p className="text-zinc-400">
                30초 안에 가치를 확인하고 리드를 남기세요. UTM 파라미터는
                자동으로 수집됩니다.
              </p>
            </div>
            <Suspense fallback={<p className="text-zinc-500">폼 로딩...</p>}>
              <LeadForm />
            </Suspense>
          </div>
        </section>

        <FaqSection />
      </main>
    </div>
  );
}