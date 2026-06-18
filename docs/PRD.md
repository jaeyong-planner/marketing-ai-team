# PRD: Hermes 스타일 24시간 AI 마케팅 콘텐츠 팀 + 풀 퍼널 런칭 시스템

> 이 문서는 `.taskmaster/docs/prd.txt` 의 가독성 좋은 버전입니다.  
> 실제 Task Master 파싱은 `.taskmaster/docs/prd.txt` 를 사용하세요.

**프로젝트 폴더**: `C:\Users\carro\Desktop\marketing`  
**참조**: https://youtu.be/96BAQ3v3NhI  
**기획일**: 2026-06-19  
**목표 기간**: 1~3개월 (중기 풀 구축)

---

## 프로젝트 비전

**"인간은 승인만 하면 된다. AI 팀이 24시간 연구하고, 쓰고, 배포 준비까지 끝낸다."**

후츠릿 영상과 정확히 같은 시나리오를 따라:
- Hermes Agent (또는 Langflow 기반 자율 에이전트)로 **영구 실행 AI 콘텐츠/마케팅 팀**을 만든다.
- 이 팀이 실제로 돌아가는 것을 보여주는 **고전환 마케팅 웹사이트 + Supabase 풀 퍼널**을 동시에 구축한다.
- 전략 문서, 콘텐츠, 광고 세팅, 분석 체계까지 모두 포함하는 **완전한 마케팅 런칭 패키지**를 완성한다.

---

## 주요 산출물 (사용자가 선택한 범위)

- 마케팅 전략 / PRD / 캠페인 플랜 문서
- 랜딩 페이지 / 마케팅 웹사이트
- 콘텐츠 에셋 (블로그, 이메일, 소셜, 스크립트)
- 광고/퍼포먼스 세팅 + 추적 (Meta, Google)
- 리드 관리 시스템 (Supabase + 폼 + CRM)
- 분석/대시보드 + A/B 테스트 인프라

**기술 스택 강조**: Supabase 적극 활용 (인증, DB, Edge Functions, Realtime)

---

## 핵심 아키텍처 컨셉 (Hermes 스타일)

1. **Persistent AI Team** (VPS/서버에서 항상 켜짐)
   - Researcher, Writer, SEO Analyst, Publisher, Reviewer 등 역할 분담 에이전트
2. **Human-in-the-Loop 승인 게이트**
   - Discord / 웹 대시보드 / 이메일 중 하나
3. **Single Source of Truth = Supabase**
   - Leads, Content Calendar, Approvals, Published Log, Campaigns, Events
4. **Public Face = 고성능 마케팅 사이트**
   - 방문 → 이해 → 신뢰 → 리드 제출 → 자동 감사 + nurture
5. **측정 가능한 운영**
   - UTM, 픽셀, 이벤트 수집 → 대시보드 → AI 팀이 성과 기반으로 다음 아이디어 제안

---

## 지금 당장 할 수 있는 다음 액션

```powershell
cd "$env:USERPROFILE\Desktop\marketing"

# 1. Task Master로 PRD 파싱 (태스크 자동 생성)
npx task-master-ai parse-prd .taskmaster/docs/prd.txt

# 2. 전체 태스크 확인
npx task-master-ai list

# 3. 다음 할 일 추천
npx task-master-ai next

# 4. 복잡도 분석 (강력 추천)
npx task-master-ai analyze-complexity --research
```

그 후 주요 태스크를 expand 하고, 병렬로 작업 시작.

---

## 열린 질문 (Open Questions) — 빠른 답변 필요

1. **이 AI 마케팅 시스템 자체를 제품으로 판매할 것인가**, 아니면 특정 기존 프로젝트(사주, 스토리캐스트, 연구 도구 등)를 이 시스템으로 마케팅할 것인가?
2. **주 에이전트 스택**: Hermes Agent 그대로? Langflow Desktop + ollama + cloud 모델 조합? 아니면 다른?
3. **승인 인터페이스 선호**: Discord가 제일 편한가, 아니면 전용 웹 승인 대시보드가 좋은가?
4. **첫 파일럿 타겟**: 구체 제품 하나를 정해서 이 시스템으로 실제 런칭 파일럿을 돌릴지?
5. **VPS 예산**: 월 1~2만 원대 Hostinger나 유사 서비스로 충분한가?

이 질문들에 답해주시면 PRD를 더 구체화하고, 바로 Supabase 스키마 + 초기 아키텍처 설계로 들어갈 수 있습니다.

---

**기획 완료. 이제 실행 단계로 넘어갑시다.**

이 PRD를 기반으로 Task Master 태스크를 생성하고, 하나씩 검증하면서 진행하겠습니다.
