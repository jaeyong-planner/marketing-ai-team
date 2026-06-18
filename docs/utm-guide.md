# UTM 템플릿 가이드 (Task #9)

## 기본 템플릿

```
https://YOUR_DOMAIN/?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={content}&utm_term={term}
```

## 채널별 예시

| 채널 | utm_source | utm_medium | utm_campaign 예시 |
|------|------------|------------|---------------------|
| Meta 광고 | facebook | paid_social | launch_2026_q2 |
| Google Ads | google | cpc | ai_marketing_demo |
| 이메일 | newsletter | email | weekly_digest |
| 블로그 | blog | organic | hermes_pipeline_post |

## 저장 위치

- `leads` 테이블: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- `analytics_events`: `lead_submit` payload에 UTM 포함

## 추적 스택

1. **GTM** — `NEXT_PUBLIC_GTM_ID` 설정 시 layout에 자동 로드
2. **Meta Pixel** — `NEXT_PUBLIC_META_PIXEL_ID` 설정 시 PageView + Lead
3. **Supabase** — `POST /api/analytics` → `analytics_events`

## 검증

- GTM Preview / Meta Pixel Helper로 `page_view`, `lead_submit` 확인
- 리드 제출 후 `leads.utm_campaign` 값 일치 확인