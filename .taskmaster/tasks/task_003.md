# Task ID: 3

**Title:** 24시간 AI 에이전트 팀 아키텍처 구축 (Hermes/Langflow)

**Status:** pending

**Dependencies:** 1 ✓, 2

**Priority:** high

**Description:** Researcher→Writer→Editor→SEO→Publisher→Analyst 역할의 자율 에이전트 파이프라인을 VPS 또는 서버에서 지속 실행 가능하게 구축한다.

**Details:**

docs/AI-Team-Architecture.md 기반 구현. Option A: Hermes Agent + systemd/pm2. Option B: Langflow 워크플로우 + cron/queue. 각 에이전트 프롬프트 템플릿(agent-prompts/) 정의. 스케줄 트리거(매 4~6시간) + 수동 주제 주입 API. agent_runs 테이블에 실행 로그 저장. gemma3:4b(로컬) + 클라우드 모델 폴백. 모니터링: 로그 파일 + Supabase agent_runs.

**Test Strategy:**

에이전트 1사이클(Researcher→Writer) 수동 트리거 후 content_calendar에 draft 레코드 생성, agent_runs에 2건 이상 로그, VPS 재부팅 후 자동 재시작 확인
