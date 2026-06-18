# 운영 매뉴얼 (Task #12)

## 일일 체크리스트 (5분)

- [ ] `/admin/approvals` — `pending_review` 처리 (승인/거절/수정요청)
- [ ] `/admin/leads` — 신규 리드 확인
- [ ] VPS/agent 로그 — `agent_runs` 최근 4h 내 레코드 (`/admin` 대시보드 또는 Supabase)
- [ ] 에러 알림 — `agent_runs.status = failed` 건 조사

## 주간 체크리스트 (30분)

- [ ] `/admin/analytics` — KPI·A/B variant 비교
- [ ] `docs/weekly-report-template.md` 작성
- [ ] `content/topics.json` — 주제 2~3개 추가
- [ ] `npm run test:e2e` 회귀 (릴리스 전)
- [ ] Supabase `db push --dry-run` drift 확인

## 승인 1건 처리 (신규 운영자)

1. `/login` → admin 계정 로그인
2. `/admin/approvals` — 대기 콘텐츠 검토
3. **승인** 클릭 (코멘트 선택)
4. `/admin/content` — **발행** 버튼
5. `published_posts` URL 확인

## 장애 대응

| 증상 | 조치 |
|------|------|
| E2E 실패 | `npm run build` → `npm run start:e2e` (turbopack dev 혼용 금지) |
| 스케줄러 중단 | VPS: `pm2 restart marketing-agent` 또는 `docker compose restart` |
| RLS 오류 | service role API 경로 사용 여부 확인 |

## 명령 참조

```powershell
npm run batch:content      # 콘텐츠 배치
npm run agent:scheduler    # 로컬 24/7
npm run test:e2e           # 전체 E2E
npm run test:vps-ready     # VPS 배포 전 점검
```