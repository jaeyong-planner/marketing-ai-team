# 런칭 플레이북 (MVP)

## MVP 체크리스트 (80% 목표)

- [x] 이메일 로그인 + `/admin` 보호
- [x] 랜딩 Hero + 리드 폼 + UTM
- [x] AI 파이프라인 + 승인 게이트
- [x] VPS 스케줄러 템플릿
- [x] GTM/Pixel + analytics_events
- [x] 콘텐츠 배치 + KPI 대시보드
- [x] 프로덕션 도메인 + HTTPS — https://marketing-ai-team-ten.vercel.app
- [ ] Meta/Google 테스트 광고 1건
- [x] Lighthouse 모바일 90+ — performance 100 (2026-06-19)

## 런칭 순서

1. **Vercel** — Next.js 배포, env 변수 설정
2. **Supabase** — 프로덕션 프로젝트, RLS 유지
3. **VPS** — `deploy/vps-setup.sh`, agent-worker 기동
4. **추적** — `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
5. **콘텐츠** — `npm run batch:content` 후 승인 5건+
6. **광고** — `docs/utm-guide.md` UTM 링크로 소액 테스트

## 포트폴리오 정리

- README 현황 섹션
- `docs/PIPELINE-E2E.md` — E2E 증빙
- 스크린샷: `/admin`, `/admin/approvals`, `/admin/analytics`
- [x] GitHub public repo — https://github.com/jaeyong-planner/marketing-ai-team