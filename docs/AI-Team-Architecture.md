# AI 마케팅 팀 아키텍처 개요 (Hermes 스타일)

## 목표
노트북을 꺼도 24시간 동작하는 **자율 AI 콘텐츠 + 마케팅 팀** 구축.
인간은 "승인" 단계만 담당.

## 에이전트 역할 분담 (예시)

| 역할              | 책임                                      | 주요 출력                  |
|-------------------|-------------------------------------------|----------------------------|
| Researcher        | 트렌드/경쟁사/키워드 조사, 인사이트 추출   | 리서치 리포트 + 소스 링크   |
| Writer            | 블로그, 소셜, 이메일 초안 작성             | 구조화된 마크다운 + 메타   |
| Editor/Reviewer   | 품질 검수, 사실 확인, 톤 조정              | 수정된 초안 + 코멘트       |
| SEO Analyst       | 키워드 최적화, 메타, 내부 링크 제안        | SEO 메타데이터             |
| Publisher         | 배포 준비 (캘린더 등록, 이미지, 포맷 변환) | Supabase 발행 레코드       |
| Analyst           | 성과 데이터 분석, 다음 아이디어 제안       | 개선 리포트 + 주제 제안     |

## 전체 흐름

1. **트리거** (스케줄 or 수동 목표 주입)
2. Researcher 실행 → 리서치 결과 Supabase 저장
3. Writer 실행 → 초안 생성
4. **Human Approval Gate** (Discord / 웹 UI)
   - 승인 or 수정 요청 or 거절
5. 승인 시 → Editor/SEO → Publisher
6. Publisher → Supabase published_posts + 외부 배포 (API)
7. Analyst → 성과 기반 다음 주제 추천 (루프)

## 데이터 모델 (Supabase 핵심 테이블)

- `leads` — 리드 정보 + 소스
- `content_calendar` — 주제, 상태, 에이전트 작업 로그, 승인 상태
- `approvals` — 승인 히스토리 + 코멘트
- `published_posts` — 실제 발행된 콘텐츠 + URL + 채널
- `campaigns` + `ad_performance` — 광고 데이터
- `agent_runs` — 각 에이전트 실행 로그 (디버깅/개선용)

## 기술 선택지

**Option A (영상 그대로)**: Hermes Agent (Nous Research) + VPS + Discord
**Option B (유연)**: Langflow (또는 n8n) 워크플로우 + 로컬 모델 + Edge Functions
**Option C (하이브리드)**: Hermes + Langflow 일부 보조

## 승인 인터페이스 후보

1. Discord 봇 (가장 빠름, 영상과 동일)
2. Supabase + 간단 Next.js 대시보드 (더 제어 가능)
3. 이메일 + 링크 (가장 간단)

## 비용 고려 (월 기준 목표)

- VPS (Hostinger 등): 1~2만 원
- Supabase (프로 무료 또는 저가)
- LLM 사용량 (연구 + 생성): 모델 선택에 따라 변동
- 도메인 + 이메일 서비스

## 다음 문서화 필요 항목

- 구체 에이전트 프롬프트 템플릿
- 워크플로우 다이어그램 (Mermaid)
- Supabase 스키마 + RLS
- 배포 가이드 (VPS)
- 모니터링/알림 전략

이 문서는 PRD와 함께 Task Master 태스크로 분해할 예정입니다.
