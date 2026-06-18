# 프로젝트 의사결정 (Open Questions)

> Task #1 산출물 | 최종 업데이트: 2026-06-19  
> ⚠️ **임시 기본값**으로 진행 중 — 변경 원하시면 알려주세요.

## 1. 판매/마케팅 대상

- [x] **A. 이 AI 마케팅 시스템 자체**를 제품으로 판매/홍보
- [ ] **B. 기존 프로젝트 파일럿** (사주 / 스토리캐스트 / AI 툴 등)

**결정**: **A — 시스템 자체를 런칭 사례로 홍보**

**근거**: 이 `marketing` 폴더 PRD가 Hermes 스타일 AI 마케팅 팀 구축·시연을 목표로 함. 파일럿 제품(B)은 2차 단계에서 동일 파이프라인 재사용.

---

## 2. AI 에이전트 스택

- [ ] **Option A**: Hermes Agent + VPS + Discord (영상 그대로)
- [ ] **Option B**: Langflow + 로컬 gemma3:4b + Edge Functions
- [x] **Option C**: 하이브리드 (Hermes 주력 + Langflow 보조)

**결정**: **Option C — 하이브리드**

**근거**: 영상 시나리오(Hermes 24/7)를 따르되, 로컬 gemma3:4b로 비용 절감·Langflow로 빠른 프로토타입. VPS에서 Hermes 상시 실행, Langflow는 실험/보조 워크플로우.

---

## 3. 승인 채널

- [x] Discord 봇 (1차 — 가장 빠름)
- [x] 전용 웹 대시보드 (/admin/approvals) (2차 — Task #7)
- [ ] 이메일 + 링크

**결정**: **Discord 1차 + 웹 대시보드 2차**

**근거**: `docs/AI-Team-Architecture.md` — Discord가 영상과 동일하고 MVP 속도 최적. 관리 대시보드는 Task #7에서 통합.

---

## 4. 프론트엔드 스택

- [x] Next.js App Router + Vercel
- [ ] Vite + React

**결정**: **Next.js App Router + Vercel**

**근거**: PRD Technical Considerations, Supabase/Vercel 통합, SEO·A/B 테스트에 유리.

---

## 5. 예산 (월 기준)

| 항목 | 예상 비용 |
|------|-----------|
| VPS (Hostinger 등) | ₩15,000 |
| Supabase | ₩0 (Free tier) |
| LLM API (OpenAI 등) | ₩10,000~30,000 |
| 도메인/이메일 (Resend) | ₩5,000 |
| 광고 테스트 | ₩50,000 (1회성) |
| **합계 (운영)** | **₩30,000~50,000/월** |

**목표**: 인프라(VPS+Supabase) 월 1~3만 원대 유지. LLM·광고는 별도.

---

## 6. 파일럿 제품명 (B 선택 시 — 보류)

현재 A(시스템 자체) 선택으로 **해당 없음**.

**브랜드 작업명**: `AI Marketing Team` (가칭)

**타겟 키워드**: AI 마케팅 자동화, 24시간 콘텐츠 팀, Hermes 에이전트

**랜딩 URL (예정)**: Vercel 배포 후 확정

---

## 사용자 확인 필요 (변경 시 알려주세요)

1. A → B로 파일럿 제품 전환 여부
2. Hermes 단독 vs 하이브리드 유지
3. Discord 없이 웹만 사용 여부
4. 월 예산 상한