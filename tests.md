# Tests

> 검증하지 않은 항목은 PASS 금지. `NOT_RUN` / `BLOCKED` / `FAIL` 명시.

## 1. 공통 게이트 (매 Act 후)

| ID | 항목 | 명령 | 성공 기준 | 마지막 결과 | 일시 |
|----|------|------|-----------|-------------|------|
| T-G1 | TypeScript 빌드 | `npm run build` | exit 0 | **PASS** | 2026-06-19 |
| T-G2 | ESLint | `npm run lint` | exit 0 | NOT_RUN | — |
| T-G3 | Dev 서버 기동 | `npm run dev` | Ready + :3000 | PASS | 2026-06-19 |

## 2. Auth E2E

| ID | 항목 | 명령 | 성공 기준 | 마지막 결과 | 일시 |
|----|------|------|-----------|-------------|------|
| T-A1 | 로그인→admin | `npm run test:e2e:auth` | PASS | **PASS** | 2026-06-19 |
| T-A2 | admin 대시보드 텍스트 | E2E step 3 | Admin Dashboard 표시 | **PASS** | 2026-06-19 |
| T-A3 | 로그아웃→리다이렉트 | E2E step 4-5 | /login redirect | **PASS** | 2026-06-19 |
| T-A4 | UI signup→admin (no admin seed) | `npm run test:e2e:signup` | redirect /admin | **PASS** | 2026-06-19 |
| T-A5 | profiles 트리거 | signup 후 DB | profiles 행 존재 | NOT_RUN | — |

## 3. Supabase / DB

| ID | 항목 | 방법 | 성공 기준 | 마지막 결과 | 일시 |
|----|------|------|-----------|-------------|------|
| T-D1 | link 상태 | `npx supabase projects list` | ● marketing-ai-team | **PASS** | 2026-06-19 |
| T-D2 | 마이그레이션 적용 | db push 로그 | 2 files applied | **PASS** | 2026-06-19 |
| T-D3 | anon leads INSERT 차단 | `npm run test:rls` | RLS error | **PASS** | 2026-06-19 |
| T-D4 | service_role INSERT 허용 | `npm run test:rls` | success | **PASS** | 2026-06-19 |
| T-D5 | db drift | `npx supabase db push --dry-run` | no pending | NOT_RUN | — |

## 4. 랜딩 / 리드

| ID | 항목 | 성공 기준 | 상태 |
|----|------|-----------|------|
| T-L1 | Hero 30초 가치 전달 | 3섹션 이상 | **PASS** | build/수동 |
| T-L2 | 모바일 3 breakpoint | 레이아웃 깨짐 없음 | NOT_RUN |
| T-L3 | 리드 폼 3건 제출 | leads 테이블 | **PASS** | e2e-leads 1건 |
| T-L4 | UTM 파라미터 저장 | utm_* 필드 | **PASS** | e2e-leads |
| T-L5 | Lighthouse 모바일 | score ≥ 90 | NOT_RUN |

## 5. 승인 / 에이전트

| ID | 항목 | 명령 | 성공 기준 | 마지막 결과 | 일시 |
|----|------|------|-----------|-------------|------|
| T-P1 | Researcher→Writer→pending_review | `npm run test:e2e:approval` | content_calendar pending_review | **PASS** | 2026-06-19 |
| T-P2 | Approve→approved | `npm run test:e2e:approval` | status=approved | **PASS** | 2026-06-19 |
| T-P3 | 미승인 publish 차단 | `npm run test:e2e:approval` | API 403 | **PASS** | 2026-06-19 |
| T-P4 | 승인 후 publish | `npm run test:e2e:approval` | published_posts 생성 | **PASS** | 2026-06-19 |
| T-P5 | CLI agent cycle | `npm run agent:run -- "주제"` | JSON contentId | **PASS** | 2026-06-19 |
| T-P6 | 전체 E2E 회귀 | `npm run test:e2e` | auth+signup+leads+rls+approval | **PASS** | 2026-06-19 |
| T-P7 | VPS 스케줄러 1사이클 | `npm run test:scheduler` | +2 agent_runs, pending_review | **PASS** | 2026-06-19 |

**E2E 사전 조건**: `npm run build` 후 `npm run start:e2e` (port 3002). turbopack dev와 production 혼용 시 `.next` corruption 주의.

## 6. 추적 / Analytics (P3-1)

| ID | 항목 | 명령/방법 | 성공 기준 | 마지막 결과 | 일시 |
|----|------|-----------|-----------|-------------|------|
| T-X1 | analytics API | `POST /api/analytics` | analytics_events INSERT | **PASS** | 2026-06-19 (build) |
| T-X2 | GTM/Pixel 스크립트 | env 설정 시 layout 로드 | TrackingScripts 렌더 | **PASS** | 2026-06-19 (build) |
| T-X3 | lead_submit 이벤트 | lead-form 제출 | dataLayer + trackServer | NOT_RUN | Pixel Helper 수동 |
| T-X4 | UTM 가이드 | `docs/utm-guide.md` | 템플릿 존재 | **PASS** | 2026-06-19 |

## 8. 콘텐츠 배치 / VPS (P3-2)

| ID | 항목 | 명령 | 성공 기준 | 마지막 결과 | 일시 |
|----|------|------|-----------|-------------|------|
| T-B1 | 배치 생성 | `npm run batch:content` | blog+social+email | **PASS** | 2026-06-19 |
| T-B2 | 배치 검증 | `npm run test:batch` | calendar 15+, md files | **PASS** | 2026-06-19 |
| T-B3 | VPS 준비 | `npm run test:vps-ready` | files+topics 10+ | **PASS** | 2026-06-19 |
| T-B4 | KPI 대시보드 | `/admin/analytics` | build + render | **PASS** | 2026-06-19 |
| T-B5 | Hero A/B | 랜딩 방문 | variant cookie | NOT_RUN | 수동 |

## 9. KMS / ProjectOps

| ID | 항목 | 성공 기준 | 마지막 결과 | 일시 |
|----|------|-----------|-------------|------|
| T-K1 | 작업 로그 저장 | operations/*.md | **PASS** | 2026-06-19 |
| T-K2 | 코드 패턴 저장 | code/*.md | **PASS** | 2026-06-19 |
| T-K3 | 벡터 인덱스 갱신 | query_aios_kms.py | BLOCKED | scripts 없음 |
| T-K4 | ProjectOps 5파일 | 루트 존재 | **PASS** | 2026-06-19 |

## 10. 회귀 체크리스트 (릴리스 전)

- [x] T-G1 PASS
- [x] T-A1 PASS
- [x] T-D3 PASS (RLS)
- [x] T-P6 PASS (full e2e)
- [ ] `.env.local` gitignore 확인
- [ ] 비밀키 커밋 없음 (`git status`)

## 11. 실패 시 기록 위치

- 실패 로그 → `/status.md` append
- 새 테스트 항목 → 이 파일에 ID 추가
- 반복 실패 방지 → `/rules.md` Learn 반영