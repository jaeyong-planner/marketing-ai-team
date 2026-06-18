export const HERO_EXPERIMENT = "hero_headline_v1" as const;

export const HERO_VARIANTS = {
  a: {
    id: "a",
    headline: "승인만 하면,",
    highlight: "AI가 마케팅합니다",
    sub: "연구 → 초안 → 인간 승인 → 배포 준비. 노트북을 닫아도 VPS에서 에이전트가 콘텐츠 파이프라인을 돌립니다.",
  },
  b: {
    id: "b",
    headline: "24시간 콘텐츠 팀,",
    highlight: "당신은 승인만",
    sub: "Hermes 스타일 AI 마케팅. 초안은 자동, 품질은 승인 게이트로 통제합니다.",
  },
} as const;

export type HeroVariantId = keyof typeof HERO_VARIANTS;

export function pickVariant(cookieValue?: string | null): HeroVariantId {
  if (cookieValue === "a" || cookieValue === "b") return cookieValue;
  return Math.random() < 0.5 ? "a" : "b";
}