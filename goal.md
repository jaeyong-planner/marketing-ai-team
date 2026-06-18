# Goal

## 1. Project Summary

**Marketing AI Team**은 Hermes 스타일의 24시간 AI 마케팅 팀을 구축·시연하는 프로젝트다. AI가 연구·작성·배포 준비를 자동화하고, 인간은 승인만 수행한다. Next.js + Supabase + VPS 에이전트 파이프라인으로 랜딩·리드·콘텐츠·승인·분석까지 풀 퍼널을 만든다.

## 2. Problem

- 마케팅 콘텐츠 생산·배포·측정이 수동·분산되어 있어 24시간 운영이 어렵다.
- AI 에이전트 산출물을 승인 없이 배포하면 품질·브랜드 리스크가 있다.
- 리드·콘텐츠·캠페인 데이터가 한곳에 모이지 않아 KPI 추적이 어렵다.

## 3. Target User

| 사용자 | 니즈 |
|--------|------|
| **운영자(관리자)** | 로그인 후 리드·콘텐츠·승인을 한 화면에서 처리 |
| **방문자(리드)** | 랜딩에서 가치 이해 후 데모/리드 제출 |
| **개발/운영 에이전트** | Task Master + ProjectOps + KMS로 반복 가능한 실행 |

## 4. Desired Outcome

1. Supabase 기반 DB·인증·RLS가 동작하는 웹 앱
2. 이메일 로그인 관리자 + `/admin` 보호
3. AI 에이전트 파이프라인이 초안을 생성하고 승인 게이트를 통과
4. 랜딩·리드·추적·대시보드로 MVP 런칭 가능
5. CreamWIKI/KMS에 작업·패턴이 축적되어 재사용 가능

## 5. Scope

**현재 Phase (MVP Foundation)**

- [x] Next.js App Router 스캐폴딩
- [x] Supabase 프로젝트 link + 마이그레이션 push
- [x] 이메일 로그인/회원가입 + middleware + `/admin` 기본 대시보드
- [x] Playwright E2E auth 검증
- [x] ProjectOps 5문서 (`goal/rules/plan/tests/status`)
- [x] 랜딩 페이지 고전환 섹션 (Task #5)
- [x] 리드 캡처 폼 (Task #6)
- [x] 승인 게이트 (Task #4)
- [x] AI 에이전트 파이프라인 (Task #3)

**Task Master 12개 태스크** — `.taskmaster/tasks/tasks.json` SSOT

## 6. Non-Scope

- 소셜 OAuth (Google/GitHub 등) — **이메일 로그인만**
- K-ESGOS/CreamOS 원본 수정·삭제
- 프로덕션 광고 대규모 집행 (가이드·소액 테스트만)
- 기존 `.taskmaster/`, `docs/PRD.md` 구조 변경

## 7. Functional Requirements

| ID | 요구사항 | 상태 |
|----|----------|------|
| FR-1 | 이메일 회원가입/로그인/로그아웃 | DONE |
| FR-2 | `/admin` 인증 보호 (미인증 → `/login`) | DONE |
| FR-3 | `profiles` 자동 생성 (auth 트리거) | DONE |
| FR-4 | leads INSERT + UTM 수집 | DONE |
| FR-5 | content_calendar + approvals 상태머신 | DONE |
| FR-6 | 승인 전 publish 차단 | DONE |
| FR-7 | 랜딩 Hero + CTA + FAQ | DONE |
| FR-8 | admin 리드/콘텐츠/승인 뷰 | DONE |

## 8. Non-Functional Requirements

| 항목 | 기준 |
|------|------|
| 보안 | RLS admin-only CRUD, `.env.local` gitignore, 키 KMS 원문 미저장 |
| 성능 | Lighthouse 모바일 90+ (Task #5), LCP < 2.5s 목표 |
| 유지보수 | TypeScript, ProjectOps 문서, Task Master 동기화 |
| 검증 | `npm run build` + `npm run test:e2e:auth` 필수 |
| KMS | 작업 종료 시 `Documents/CreamWIKI/memory/wiki/` 저장 |

## 9. Acceptance Criteria

- [x] `npm run build` 성공
- [x] `npm run test:e2e:auth` PASS
- [x] Supabase `fuxbltvmuymlrderuvzq` link + 마이그레이션 2개 적용
- [x] `/login` → `/admin` → signout → `/admin` redirect E2E
- [x] UI signup만으로 즉시 로그인 (`config push` enable_confirmations=false)
- [x] 리드 폼 제출 → `leads` 테이블 저장
- [x] 승인 1건 E2E (pending_review → approved → publish)
- [ ] 랜딩 Lighthouse 모바일 90+

## 10. Validation Criteria

| 검증 | 명령/방법 | 성공 기준 |
|------|-----------|-----------|
| 빌드 | `npm run build` | exit 0 |
| Auth E2E | `npm run test:e2e:auth` | PASS 로그 |
| Lint | `npm run lint` | exit 0 (NOT_RUN 허용 시 명시) |
| DB | `npx supabase db push --dry-run` | drift 없음 |
| RLS | anon INSERT leads | 차단 확인 (수동) |

## 11. Final Deliverables

1. **웹 앱** — `src/`, Vercel 배포 가능
2. **DB** — `supabase/migrations/`, ERD `docs/supabase-erd.md`
3. **문서** — PRD, decisions, ProjectOps 5파일, OPERATIONS (Task #12)
4. **테스트** — `scripts/e2e-auth.mjs`, `tests.md` 체크리스트
5. **KMS** — code/operations work-log (CreamWIKI)
6. **에이전트** — `agent-prompts/`, VPS 24/7 (Task #11)