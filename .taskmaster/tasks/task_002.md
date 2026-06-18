# Task ID: 2

**Title:** Supabase 프로젝트 생성 및 핵심 스키마 설계

**Status:** pending

**Dependencies:** 1 ✓

**Priority:** high

**Description:** 리드, 콘텐츠 캘린더, 승인, 발행, 캠페인, 분석 이벤트를 위한 PostgreSQL 스키마와 RLS 정책을 구축한다.

**Details:**

테이블: leads(id, email, name, source, utm_*, created_at), content_calendar(id, title, type, status, body_md, meta_json, scheduled_at, agent_run_id), approvals(id, content_id, status, reviewer, comment, decided_at), published_posts(id, content_id, channel, url, published_at), campaigns(id, name, platform, budget), analytics_events(id, event_type, payload, session_id), agent_runs(id, agent_role, input, output, status, duration_ms). RLS: 인증된 admin만 CRUD. 마이그레이션 SQL을 supabase/migrations/에 저장. Supabase CLI link 및 db push.

**Test Strategy:**

로컬/리모트에서 마이그레이션 적용 성공, anon 키로 leads INSERT 차단·service_role로 INSERT 허용, ERD 다이어그램 docs/에 저장
