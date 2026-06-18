# Task ID: 11

**Title:** VPS 24/7 배포 및 운영 인프라

**Status:** pending

**Dependencies:** 3

**Priority:** high

**Description:** 노트북 종료 후에도 AI 에이전트가 동작하도록 VPS에 영구 실행 환경을 구축한다.

**Details:**

Hostinger 등 VPS(월 1~3만원 목표). Docker Compose: hermes/langflow + 환경변수. systemd 또는 pm2 자동 재시작. HTTPS(nginx/caddy). 로그 로테이션. 백업: Supabase는 managed, 에이전트 설정 git. 비용 모니터링 체크리스트.

**Test Strategy:**

VPS SSH 접속, 에이전트 24시간 uptime 확인, 로컬 PC 종료 후에도 agent_runs 4시간 내 신규 레코드, 재부팅 후 자동 복구
