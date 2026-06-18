# Task ID: 6

**Title:** 리드 캡처 폼 및 이메일 자동화 연동

**Status:** pending

**Dependencies:** 2, 5

**Priority:** high

**Description:** 랜딩 페이지 리드 폼을 Supabase에 저장하고 즉시 감사/ nurture 이메일 자동화를 연결한다.

**Details:**

폼 필드: name, email, interest(선택). Supabase leads INSERT(RLS: public insert 허용 또는 Edge Function 경유). UTM 파라미터 자동 수집. Resend/SendGrid Edge Function: welcome email 발송. honeypot + rate limit 스팸 방지. leads 테이블 source 필드에 utm_campaign 매핑.

**Test Strategy:**

테스트 제출 3건→leads 테이블 저장+UTM 기록, welcome 이메일 1분 내 수신, 스팸 honeypot 차단 확인
