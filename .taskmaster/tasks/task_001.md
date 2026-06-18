# Task ID: 1

**Title:** 프로젝트 기반 세팅 및 Open Questions 확정

**Status:** done

**Dependencies:** None

**Priority:** high

**Description:** PRD의 미결정 사항(타겟 제품, Hermes vs Langflow, 승인 채널, 예산)을 확정하고 개발 환경·폴더 구조·Git 저장소를 준비한다.

**Details:**

1) Open Questions 답변 문서 작성 (docs/decisions.md): 판매 대상(시스템 자체 vs 파일럿 제품), 에이전트 스택(Hermes/Langflow/하이브리드), 승인 채널(Discord/웹/이메일), VPS 예산. 2) src/, assets/, content/, supabase/ 디렉토리 생성. 3) Next.js App Router 또는 Vite+React 스택 결정 및 스캐폴딩. 4) .env.example 키 목록 정리(SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY 등). 5) Task Master 워크플로우 문서화.

**Test Strategy:**

decisions.md에 5개 Open Questions 모두 답변 존재, npm run dev 로컬 실행 성공, .env.example과 README 명령어 일치 확인

## Subtasks

### 1.1. Open Questions 답변 문서 작성

**Status:** done  
**Dependencies:** None  

docs/decisions.md에 PRD 미결정 사항 5항목 확정(임시 기본값 포함)

**Details:**

판매대상 A(시스템 자체), 하이브리드 Hermes+Langflow, Discord+웹 승인, Next.js, 월 예산표 작성

### 1.2. 프로젝트 폴더 구조 확정

**Status:** done  
**Dependencies:** None  

src/, assets/, content/, supabase/, agent-prompts/ 디렉토리 준비

**Details:**

기존 .gitkeep 구조 유지, Next.js는 src/app 사용

### 1.3. Next.js App Router 스캐폴딩

**Status:** done  
**Dependencies:** 1.2  

TypeScript + Tailwind v4 + 기본 랜딩 placeholder

**Details:**

package.json, next.config.ts, src/app/layout.tsx, page.tsx. npm run build 성공

### 1.4. 환경변수 템플릿 및 Git 준비

**Status:** done  
**Dependencies:** None  

.env.example Supabase/Discord/Analytics 키 정리, .gitignore Next.js 항목 추가

**Details:**

OPENAI, SUPABASE, RESEND, DISCORD, META/GTM 변수 문서화
