# Task ID: 9

**Title:** 광고·퍼포먼스 추적 인프라 세팅

**Status:** pending

**Dependencies:** 5, 6

**Priority:** medium

**Description:** Meta Pixel, GTM, UTM 템플릿, Supabase 이벤트 수집으로 광고 성과를 측정 가능하게 한다.

**Details:**

랜딩에 Meta Pixel + Google Tag Manager 설치. UTM 템플릿 문서(docs/utm-guide.md). analytics_events에 page_view, lead_submit, cta_click 수집. campaigns 테이블에 테스트 캠페인 1~2개 등록. Meta/Google Ads 초기 테스트 캠페인 가이드(예산 소액). CPA/CPL 계산 쿼리.

**Test Strategy:**

Pixel Helper/GTM Preview에서 이벤트 확인, UTM 링크 클릭 시 leads.source 정확, 테스트 광고 1건 impressions 기록
