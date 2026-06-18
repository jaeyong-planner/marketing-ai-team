# Task ID: 7

**Title:** 운영 관리 대시보드 (리드·콘텐츠·승인)

**Status:** pending

**Dependencies:** 2, 4, 5

**Priority:** medium

**Description:** Supabase Auth 기반 관리자 페이지에서 리드 목록, 콘텐츠 상태, 승인 액션을 한 화면에서 처리한다.

**Details:**

경로: /admin (이메일 로그인 only). 뷰: Leads 테이블(필터/CSV export), Content Calendar(kanban: draft/review/approved/published), Approval Queue(일괄 승인). Realtime 구독으로 신규 리드 알림. Edge Function 연동 버튼: Approve→publish 트리거.

**Test Strategy:**

admin 로그인 후 비인증 /admin 접근 401, 리드 실시간 반영, 콘텐츠 상태 변경이 DB와 UI 동기화
