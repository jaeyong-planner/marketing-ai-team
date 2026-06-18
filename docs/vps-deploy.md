# VPS 24/7 에이전트 배포 가이드 (Task #11)

노트북을 꺼도 **Researcher → Writer** 파이프라인이 주기적으로 실행되어 `content_calendar`에 `pending_review` 초안을 쌓습니다.

## 아키텍처

```
VPS (Docker / PM2 / systemd)
  └── scripts/agent-scheduler.mjs
        └── scripts/lib/agent-cycle.mjs
              └── Supabase (service role)
                    ├── agent_runs
                    ├── content_calendar (pending_review)
                    └── approvals (pending)
```

웹 앱(Next.js)은 Vercel 등에 별도 배포. VPS는 **에이전트 워커만** 실행합니다.

## 사전 요구사항

- Node.js 20+ 또는 Docker
- Supabase `SUPABASE_SERVICE_ROLE_KEY` (VPS `.env`에만 저장, git 금지)
- `content/topics.json` — 주제 풀

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | 필수 |
| `SUPABASE_SERVICE_ROLE_KEY` | service role | 필수 |
| `AGENT_MOCK` | mock LLM 사용 | `true` |
| `AGENT_INTERVAL_MS` | 사이클 간격(ms) | `14400000` (4h) |
| `OPENAI_API_KEY` | mock=false 시 필수 | — |

## 로컬 검증

```powershell
cd $env:USERPROFILE\Desktop\marketing
npm run test:scheduler          # 1회 사이클 검증
npm run agent:run -- "테스트 주제"
$env:AGENT_MAX_CYCLES="1"; npm run agent:scheduler   # 1회 후 종료
```

## Option A — Docker Compose

```bash
# VPS에 repo clone 후
cp .env.example .env   # 키 입력
docker compose up -d --build agent-worker
docker compose logs -f agent-worker
```

## Option B — PM2

```bash
npm ci --omit=dev
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

## Option C — systemd

```bash
sudo useradd -r -m marketing || true
sudo cp -r . /opt/marketing
sudo cp deploy/marketing-agent.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now marketing-agent
journalctl -u marketing-agent -f
```

## 운영 체크리스트

- [ ] `agent_runs` 4시간 내 신규 레코드 (또는 `AGENT_INTERVAL_MS` 주기)
- [ ] VPS 재부팅 후 프로세스 자동 복구 (Docker restart / PM2 / systemd)
- [ ] 로그 로테이션 (Docker json-file 옵션 또는 journald)
- [ ] `.env` 백업 — git 제외, 비밀 관리자만 접근
- [ ] Supabase 백업 — managed (대시보드 PITR)

## 비용 모니터링

| 항목 | 목표 |
|------|------|
| VPS (Hostinger 등) | 월 ₩15,000~30,000 |
| Supabase | Free/Pro |
| OpenAI (mock=false) | 사용량 알림 설정 |

## 승인 흐름

VPS는 초안만 생성합니다. **승인·발행**은 `/admin/approvals` 웹 UI에서 수행합니다.