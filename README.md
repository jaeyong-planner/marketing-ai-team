# Marketing Project — 24h AI Marketing Team (Hermes 스타일)

바탕화면의 `marketing` 폴더입니다.

## 🎯 프로젝트 비전 (한 줄 요약)

**"인간은 승인만 하면 된다. AI가 24시간 연구·작성·배포 준비를 끝낸다."**

참조 영상: [Hermes로 24시간 일하는 AI 콘텐츠팀 만들기](https://youtu.be/96BAQ3v3NhI)

---

## 현재 상태 (2026-06-19)

- ✅ Phase 1 MVP — Auth, 랜딩, 리드, admin, RLS E2E
- ✅ Phase 2 — AI 파이프라인, 승인 게이트, VPS 스케줄러
- ✅ Phase 3 — GTM/Pixel 추적, 콘텐츠 배치, KPI/A/B 대시보드
- ✅ Supabase `marketing-ai-team` link + 마이그레이션 2개
- ✅ `npm run test:e2e` · `test:batch` · `test:scheduler` PASS
- 📄 운영: `docs/OPERATIONS.md`, `docs/LAUNCH-PLAYBOOK.md`, `docs/vps-deploy.md`
- ✅ **Production**: https://marketing-ai-team-ten.vercel.app
- ✅ Lighthouse mobile performance **100**
- ⏳ **다음**: VPS 실제 호스트 배포, 광고 테스트

### 주요 명령

```powershell
npm run build && npm run start:e2e   # E2E용 서버 :3002
npm run test:e2e
npm run batch:content
npm run agent:scheduler
```

---

## 폴더 구조

```
marketing/
├── README.md
├── CLAUDE.md                  # AI 에이전트 컨텍스트 (지식화)
├── docs/
│   ├── PRD.md                 # 가독성 좋은 PRD
│   ├── AI-Team-Architecture.md
│   ├── TASK-INDEX.md          # 태스크 인덱스
│   └── decisions.md           # Open Questions 답변 (Task #1)
├── .taskmaster/
│   ├── docs/prd.txt           # Task Master 공식 PRD
│   ├── tasks/tasks.json       # 태스크 SSOT (12개)
│   ├── tasks/task-001~012.md  # 개별 태스크 파일
│   └── reports/task-complexity-report.json
├── src/                       # 웹사이트 / 코드
├── assets/                    # 이미지, 브랜드 자산
├── content/                   # 생성된 콘텐츠 원본
├── agent-prompts/             # 에이전트 프롬프트 템플릿
└── supabase/migrations/       # DB 마이그레이션
```

---

## 핵심 산출물 범위 (사용자 확정)

- 마케팅 전략 / 캠페인 플랜 문서
- 랜딩 페이지 + 마케팅 웹사이트
- 대량 콘텐츠 에셋 (블로그·이메일·소셜·스크립트)
- Meta/Google 광고 + 추적 세팅
- Supabase 리드/CRM/콘텐츠 캘린더/승인 시스템
- 분석 대시보드 + A/B 테스트 인프라

**기술 우선순위**: Supabase 적극 활용 (인증, DB, Edge Functions, Realtime)

---

## 빠른 시작 명령어 (PowerShell)

```powershell
cd "$env:USERPROFILE\Desktop\marketing"

# ⚠️ CLI는 task-master (task-master-ai는 MCP 서버)
# 태스크 확인
npx --yes --package=task-master-ai task-master list

# 다음 할 일 추천
npx --yes --package=task-master-ai task-master next

# 태스크 상세
npx --yes --package=task-master-ai task-master show 1

# 작업 시작/완료
npx --yes --package=task-master-ai task-master set-status --id=1 --status=in-progress
npx --yes --package=task-master-ai task-master set-status --id=1 --status=done

# 복잡도 리포트 (이미 생성됨)
npx --yes --package=task-master-ai task-master complexity-report

# 고복잡도 태스크 분해 (API 키 필요)
npx --yes --package=task-master-ai task-master expand --id=3 --num=8 --research
```

---

## 주요 문서

- [CLAUDE.md](./CLAUDE.md) — AI 에이전트용 프로젝트 컨텍스트
- [docs/PRD.md](./docs/PRD.md) — 전체 기획 상세
- [docs/TASK-INDEX.md](./docs/TASK-INDEX.md) — 12개 태스크 인덱스 + MVP 범위
- [docs/decisions.md](./docs/decisions.md) — Open Questions (Task #1)
- [docs/AI-Team-Architecture.md](./docs/AI-Team-Architecture.md) — 에이전트 아키텍처

---

## 다음 단계 제안

1. PRD 검토 + Open Questions 답변 (제품 선정, Hermes vs Langflow, 승인 채널 등)
2. Task Master parse + expand
3. Supabase 프로젝트 생성 + 초기 테이블
4. AI Agent 환경 세팅 (VPS or 로컬 영구 실행)
5. 랜딩 페이지 스캐폴딩 + Supabase 연동
6. 첫 콘텐츠 파이프라인 테스트 (연구 → 초안 → 승인 → 저장)

---

**준비 완료. 계획 세웠으니 이제 실행합시다.**

추가로 필요한 것 있으면 언제든 말씀해주세요!
