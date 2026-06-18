# Rules

## 1. ProjectOps 루프 (필수)

모든 작업은 **Sense → Align → Plan → Act → Verify → Learn → Repeat** 순서를 따른다.

1. `/status.md`에 Sense 결과 append
2. 목표 변경 시 `/goal.md` 갱신
3. 작업 단위는 `/plan.md`에 ID·상태 관리
4. 검증은 `/tests.md` 기준만 PASS 표기
5. 완료 조건 미충족 시 DONE 금지 → `PARTIAL` / `BLOCKED` / `NEEDS_REVIEW`

## 2. 문서 운영 규칙

| 파일 | 규칙 |
|------|------|
| `goal.md` | 북극성. 범위·완료 조건 변경 시 갱신 |
| `rules.md` | 반복 실패·품질 이슈 시 Learn 단계에서 추가 |
| `plan.md` | 작업 ID·상태·의존성 유지 |
| `tests.md` | 검증 항목·NOT_RUN/BLOCKED 명시 |
| `status.md` | **절대 덮어쓰지 않음**. 항상 append |

## 3. 구현 규칙

- 목표 없이 구현 시작 금지
- 계획 없이 3파일 이상 대규모 변경 금지
- 기존 코드·문서·설정·데이터 임의 삭제 금지
- 불필요한 리팩토링·라이브러리 추가 금지
- `.env` / `.env.local`에 비밀키 — git 커밋 금지
- Supabase: **이메일 로그인만** (OAuth 추가 시 goal 범위 수정 필요)

## 4. 품질 기준

- TypeScript 타입 명시
- 함수 SRP, ~50줄 권장
- 새 기능: 정상/경계/오류 최소 3케이스 고려
- `npm run build` 통과 없이 완료 선언 금지
- 실행하지 않은 테스트 PASS 표기 금지

## 5. KMS / CreamWIKI 연동

작업 시작 전:

- `Documents/CreamWIKI/memory/wiki/` 또는 `Downloads/CreamWIKI_External_Distribution_20260612/MD/` 근거 검색
- Auth/Next.js: Agents `027-auth`, `019-nextjs`
- 검증: Skill `08-verification-gate`

작업 종료 후:

- 코드 패턴 → `memory/wiki/code/YYYY-MM-DD-*.md`
- 운영 기록 → `memory/wiki/operations/YYYY-MM-DD-*.md`
- API 키·비밀번호 원문 KMS 저장 금지

인덱싱 스크립트 없을 시 `/status.md`에 대체안(rg/직접 참조) 기록

## 6. Supabase CLI 규칙

```powershell
cd C:\Users\carro\Desktop\marketing
# placeholder 금지: <프로젝트-ref> 사용하지 말 것
npx supabase link --project-ref fuxbltvmuymlrderuvzq
npx supabase db push --yes
```

- IPv6 미지원 네트워크: link 재실행으로 pooler URL 확보
- `db push`는 link 완료 후, **marketing 폴더**에서 실행

## 7. 안전장치

- 동일 오류 3회 반복 → `BLOCKED` 전환, 사용자 보고
- MCP/CLI 실패 시 대체안 시도 후 한계 기록
- Task Master `tasks.json`은 CLI로만 수정 (수동 편집 금지)

## 8. 금지 목록 (절대)

1. KMS 검색·기록 없이 "완료" 보고
2. `/status.md` 전체 덮어쓰기
3. `node_modules`, `.git` 내부 수동 파괴적 변경
4. 프로덕션 DB 직접 쿼리
5. 사용자 보존 지시 없는 AIOS/KMS 데이터 삭제