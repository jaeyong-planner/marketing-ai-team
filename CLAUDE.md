# Marketing AI Team — AI 에이전트 컨텍스트

## 한 줄 요약

**인간은 승인만 한다. AI가 24시간 연구→작성→배포 준비를 수행한다.**

Hermes 스타일 자율 마케팅/콘텐츠 팀 + Supabase 풀퍼널 + 랜딩 페이지 런칭 프로젝트.

## 프로젝트 위치

`C:\Users\carro\Desktop\marketing`

## 핵심 문서

| 문서 | 용도 |
|------|------|
| `.taskmaster/docs/prd.txt` | Task Master 공식 PRD |
| `docs/PRD.md` | 가독성 좋은 PRD |
| `docs/AI-Team-Architecture.md` | 에이전트 역할·데이터 모델 |
| `docs/decisions.md` | Open Questions 답변 (Task #1) |
| `.taskmaster/tasks/tasks.json` | 태스크 SSOT |
| `.taskmaster/reports/task-complexity-report.json` | 복잡도 분석 |

## 기술 스택 (PRD 확정)

- **Data**: Supabase (PostgreSQL, Auth, Edge Functions, Realtime)
- **AI Agents**: Hermes Agent (VPS) 또는 Langflow + gemma3:4b/클라우드
- **Frontend**: Next.js App Router (권장) 또는 Vite+React
- **Deploy**: Vercel (웹) + VPS (에이전트 24/7)
- **추적**: Meta Pixel, GTM, UTM, Supabase analytics_events

## Task Master 워크플로우

```powershell
cd "$env:USERPROFILE\Desktop\marketing"

# CLI는 task-master (MCP는 task-master-ai)
npx --yes --package=task-master-ai task-master list
npx --yes --package=task-master-ai task-master next
npx --yes --package=task-master-ai task-master show <id>
npx --yes --package=task-master-ai task-master set-status --id=1 --status=in-progress
npx --yes --package=task-master-ai task-master expand --id=3 --num=8
```

## 현재 태스크 현황 (2026-06-19)

- **12개 태스크** 생성 완료 (PRD 기반)
- **다음 작업**: Task #1 — Open Questions 확정 + 프로젝트 세팅
- **고복잡도(8+)**: #3 AI 에이전트, #8 콘텐츠 파이프라인, #11 VPS

## MVP 완료 기준 (Task #1~#8 + #11)

1. AI 1사이클: 연구→초안→승인→저장
2. 랜딩 배포 + 리드 5건+
3. Supabase leads 10+, content_calendar 15+
4. 승인 게이트 동작 (미승인 배포 차단)

## API 키 참고

`parse-prd` / `expand` / `analyze-complexity --research`는 유효한 API 키 필요.
현재 `.env`의 Gemini/OpenAI 키 만료 확인됨 → 갱신 후 AI 자동 생성 재시도.

필수 키: `GOOGLE_API_KEY` 또는 `OPENAI_API_KEY` 또는 `ANTHROPIC_API_KEY`

## 금지 사항

- 승인 없이 외부 배포 금지 (FR-2)
- `.env` 직접 커밋 금지
- production DB 직접 쿼리 금지