# Task ID: 4

**Title:** 인간 승인 게이트(Human Approval Gate) 구현

**Status:** pending

**Dependencies:** 2, 3

**Priority:** high

**Description:** 승인 전 외부 배포가 불가능하도록 승인 큐와 알림 인터페이스를 구현한다.

**Details:**

최소 1채널 구현(Discord 봇 권장 또는 Next.js /admin/approvals). 상태: pending_review → approved/rejected/needs_revision. Supabase approvals 테이블 + content_calendar.status 연동. Edge Function: on_approval_approved → Publisher 트리거. Discord: 버튼 Approve/Reject + 코멘트. 이메일 알림(옵션): Resend. FR-2 준수: 미승인 콘텐츠 publish API 차단.

**Test Strategy:**

draft 콘텐츠 생성→승인 대기 알림 수신→Approve 클릭→status=approved 및 Publisher 트리거 로그 확인, Reject 시 배포 미발생 검증
