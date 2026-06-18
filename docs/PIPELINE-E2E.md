# 전체 파이프라인 E2E (Task #8)

## 흐름

```
주제 풀 → Batch/Scheduler → pending_review → Admin 승인 → publish → published_posts
```

## 1. 콘텐츠 배치 생성

```powershell
npm run batch:content
npm run test:batch
```

목표: `content_calendar` 15+, `approvals` 5+, `content/blog|social|email` 마크다운 보관.

## 2. 승인 게이트

```powershell
npm run test:e2e:approval
```

또는 `/admin/approvals`에서 수동 승인.

## 3. 발행

`/admin/content`에서 승인된 항목 **발행** 또는:

```http
POST /api/content/{id}/publish
```

## 4. VPS 24/7

```powershell
npm run test:vps-ready
npm run test:scheduler
```

VPS: `docs/vps-deploy.md`, `deploy/vps-setup.sh`

## 5. KPI 확인

`/admin/analytics` — 리드, 페이지뷰, A/B variant, 승인율.