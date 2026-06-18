# Task ID: 8

**Title:** 콘텐츠 에셋 대량 생산 파이프라인

**Status:** pending

**Dependencies:** 3, 4, 7

**Priority:** medium

**Description:** AI 팀이 블로그·소셜·이메일 시퀀스를 생성하고 승인 후 배포까지 연결하는 초기 콘텐츠 물량을 확보한다.

**Details:**

주제 풀 10+개(content/topics.json). 산출 목표: 블로그 5~8편, 소셜 20+개, 이메일 nurture 5~7통. 모든 초안 content_calendar 등록. 승인 플로우 통과 후 1개 이상 채널(X 또는 블로그) 실제 배포. content/ 폴더에 마크다운 원본 보관. Publisher 에이전트: 채널별 포맷 변환.

**Test Strategy:**

content_calendar 15+ 레코드, approvals 5+ 기록, published_posts 1+ URL 존재, 전체 파이프라인 E2E 1회 문서화
