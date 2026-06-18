# Task Master 태스크 인덱스

생성일: 2026-06-19 | 소스: `.taskmaster/docs/prd.txt` | 총 12개

## 실행 순서 (의존성 기반)

```
#1 Open Questions
 ├── #2 Supabase 스키마
 │    ├── #3 AI 에이전트 팀 ── #11 VPS
 │    │    └── #4 승인 게이트
 │    ├── #5 랜딩 페이지
 │    │    ├── #6 리드 폼
 │    │    └── #9 광고 추적
 │    └── #7 관리 대시보드
 │         └── #8 콘텐츠 파이프라인
 │              └── #10 KPI/A/B
 └── #12 문서화 (8,10,11 완료 후)
```

## 태스크 목록

| ID | 제목 | 우선순위 | 복잡도 | 의존 |
|----|------|----------|--------|------|
| 1 | 프로젝트 기반 세팅 및 Open Questions 확정 | high | 4 | - |
| 2 | Supabase 프로젝트 생성 및 핵심 스키마 설계 | high | 7 | 1 |
| 3 | 24시간 AI 에이전트 팀 아키텍처 구축 | high | 9 | 1,2 |
| 4 | 인간 승인 게이트 구현 | high | 7 | 2,3 |
| 5 | 고전환 마케팅 랜딩 페이지 제작 | high | 6 | 1,2 |
| 6 | 리드 캡처 폼 및 이메일 자동화 연동 | high | 5 | 2,5 |
| 7 | 운영 관리 대시보드 | medium | 7 | 2,4,5 |
| 8 | 콘텐츠 에셋 대량 생산 파이프라인 | medium | 8 | 3,4,7 |
| 9 | 광고·퍼포먼스 추적 인프라 세팅 | medium | 6 | 5,6 |
| 10 | KPI 대시보드 및 A/B 테스트 루프 | medium | 7 | 6,8,9 |
| 11 | VPS 24/7 배포 및 운영 인프라 | high | 8 | 3 |
| 12 | 런칭 문서화 및 운영 매뉴얼 완성 | medium | 4 | 8,10,11 |

## MVP에 필요한 태스크

**Task #1 ~ #8 + #11** (총 9개)

- #9, #10, #12는 런칭 후 개선·문서화 단계

## expand 권장 (복잡도 ≥ 7)

```powershell
npx --package=task-master-ai task-master expand --id=3 --num=8
npx --package=task-master-ai task-master expand --id=2 --num=6
npx --package=task-master-ai task-master expand --id=8 --num=6
npx --package=task-master-ai task-master expand --id=11 --num=6
```

## 개별 태스크 파일

`.taskmaster/tasks/task-001.md` ~ `task-012.md`