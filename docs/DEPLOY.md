# 프로덕션 배포 (Vercel + Supabase + VPS)

## GitHub

**Repository**: https://github.com/jaeyong-planner/marketing-ai-team

```powershell
git clone https://github.com/jaeyong-planner/marketing-ai-team.git
```

CI: `.github/workflows/ci.yml` (build on push). Supabase secrets는 GitHub repo Settings → Secrets에 추가 시 RLS 테스트 실행.

## Vercel (웹 앱)

**Production**: https://marketing-ai-team-ten.vercel.app

```powershell
cd $env:USERPROFILE\Desktop\marketing
npm run deploy:env      # .env.local → Vercel
npm run deploy:vercel   # production 배포
npm run test:lighthouse # 모바일 Lighthouse (PROD_URL 또는 E2E_BASE_URL)
node scripts/prod-smoke.mjs
```

## Supabase Auth

`supabase/config.toml` → `npx supabase config push --yes`

- `site_url`: production Vercel URL
- `additional_redirect_urls`: localhost + Vercel preview 패턴

## VPS (에이전트 24/7)

웹은 Vercel, **에이전트만 VPS**:

```bash
# Ubuntu VPS
export REPO_URL=https://github.com/YOUR_USER/marketing.git  # optional
bash deploy/vps-setup.sh
```

로컬 검증: `npm run test:vps-ready` · `npm run agent:scheduler`

## 환경 변수 (Vercel Production)

| 변수 | 필수 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ |
| `NEXT_PUBLIC_SITE_URL` | ✅ (production URL) |
| `AGENT_MOCK` | 권장 `true` (Vercel API mock) |
| `NEXT_PUBLIC_GTM_ID` | 선택 |
| `NEXT_PUBLIC_META_PIXEL_ID` | 선택 |