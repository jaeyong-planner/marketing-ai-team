# Plan

> 최종 갱신: 2026-06-19  
> SSOT 보조: `.taskmaster/tasks/tasks.json` (12 tasks)

## Phase 0 — Foundation (DONE)

| ID | 작업명 | 목적 | 우선순위 | 상태 | 완료 기준 |
|----|--------|------|----------|------|-----------|
| P0-1 | ProjectOps 5문서 생성 | 실행 하네스 운영 | P0 | DONE | goal/rules/plan/tests/status 존재 |
| P0-2 | Sense 기록 | 현재 상태 파악 | P0 | DONE | status.md 첫 엔트리 |
| P1-1 | Task #1 스캐폴딩 | Next.js 기반 | P0 | DONE | npm run build |
| P1-2 | Task #2 Supabase | 스키마+RLS | P0 | DONE | db push 2 migrations |
| P1-3 | 이메일 Auth UI | admin 보호 | P0 | DONE | E2E PASS |

## Phase 1 — MVP Web (NEXT)

| ID | 작업명 | 목적 | 우선순위 | 변경 예상 파일 | 의존성 | 완료 기준 | 검증 | 상태 |
|----|--------|------|----------|----------------|--------|-----------|------|------|
| P1-4 | 이메일 확인 OFF | UI signup 즉시 로그인 | P1 | `supabase config push` | P1-3 | signup→admin redirect | E2E signup | **DONE** |
| P1-5 | Task #5 랜딩 Hero | 전환율 | P0 | `src/app/page.tsx`, components | P1-1 | Hero+CTA+FAQ 섹션 | build | **DONE** |
| P1-6 | Task #6 리드 폼 | leads 수집 | P0 | `src/app/api/leads`, LeadForm | P1-2, P1-5 | leads INSERT+UTM | e2e-leads | **DONE** |
| P1-7 | Task #7 admin 확장 | 운영 대시보드 | P1 | `src/app/admin/**` | P1-3 | Leads 테이블 뷰 | e2e-auth | **DONE** |
| P1-8 | RLS 수동 검증 | anon 차단 확인 | P1 | `scripts/verify-rls.mjs` | P1-2 | anon INSERT 실패 | test:rls | **DONE** |

## Phase 2 — AI + Approval

| ID | 작업명 | 목적 | 우선순위 | 의존성 | 상태 |
|----|--------|------|----------|--------|------|
| P2-1 | Task #3 에이전트 파이프라인 | 24h 콘텐츠 생성 | P0 | P1-2 | **DONE** |
| P2-2 | Task #4 승인 게이트 | Human-in-the-loop | P0 | P2-1 | **DONE** |
| P2-3 | Task #11 VPS 24/7 | 노트북 무관 실행 | P1 | P2-1 | **DONE** |

## Phase 3 — Growth

| ID | 작업명 | 상태 | 의존성 |
|----|--------|------|--------|
| P3-1 | Task #9 추적 Pixel/GTM | **DONE** | P1-5, P1-6 |
| P3-2 | Task #8 콘텐츠 배치 | **DONE** | P2-2, P1-7 |
| P3-3 | Task #10 KPI/A/B | **DONE** | P3-1, P3-2 |
| P3-4 | Task #12 런칭 문서 | **DONE** | P3-2, P3-3 |

## 현재 스프린트 포커스

**다음 Act 대상**: 프로덕션 배포 (Vercel + VPS) · Lighthouse · 광고 테스트

## 우선순위 규칙

1. P0: 빌드·인증·DB 무결성
2. P1: 리드·랜딩·admin 확장
3. P2: 에이전트·승인 (핵심 차별화)
4. P3: 추적·KPI·문서화

## 상태 범례

`TODO` | `IN_PROGRESS` | `DONE` | `BLOCKED` | `NEEDS_REVIEW`