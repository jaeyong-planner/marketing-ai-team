"use client";

import { useEffect, useState } from "react";
import {
  HERO_EXPERIMENT,
  HERO_VARIANTS,
  pickVariant,
  type HeroVariantId,
} from "@/lib/ab/hero-variant";
import { pushDataLayer, trackServer } from "@/lib/analytics/events";

const COOKIE_NAME = "ab_hero_variant";

function readCookie(): HeroVariantId | null {
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([ab])`));
  return match?.[1] === "a" || match?.[1] === "b" ? match[1] : null;
}

function writeCookie(variant: HeroVariantId) {
  document.cookie = `${COOKIE_NAME}=${variant};path=/;max-age=${60 * 60 * 24 * 14};SameSite=Lax`;
}

export function HeroSection() {
  const [variantId, setVariantId] = useState<HeroVariantId>("a");

  useEffect(() => {
    const existing = readCookie();
    const chosen = pickVariant(existing);
    if (!existing) writeCookie(chosen);
    setVariantId(chosen);
    void trackServer("page_view", {
      experiment: HERO_EXPERIMENT,
      variant: chosen,
      page: "hero",
    });
  }, []);

  const variant = HERO_VARIANTS[variantId];

  function trackCta(label: string) {
    pushDataLayer("cta_click", { experiment: HERO_EXPERIMENT, variant: variantId, label });
    void trackServer("cta_click", {
      experiment: HERO_EXPERIMENT,
      variant: variantId,
      label,
    });
  }

  return (
    <section className="py-16 md:py-24">
      <p className="mb-4 text-sm font-medium tracking-widest text-cyan-400 uppercase">
        Hermes 스타일 · 24/7 AI 콘텐츠 팀
        <span className="ml-2 text-zinc-600">· A/B {variantId.toUpperCase()}</span>
      </p>
      <h1 className="font-[family-name:var(--font-display)] mb-6 max-w-3xl text-4xl leading-[1.1] font-bold tracking-tight md:text-6xl">
        {variant.headline}
        <br />
        <span className="text-cyan-400">{variant.highlight}</span>
      </h1>
      <p className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-400">
        {variant.sub}
      </p>
      <div className="flex flex-wrap gap-4">
        <a
          href="#waitlist"
          onClick={() => trackCta("demo_primary")}
          className="rounded-lg bg-cyan-400 px-8 py-3.5 font-semibold text-zinc-950 transition hover:bg-cyan-300"
        >
          데모 요청하기
        </a>
        <a
          href="#how-it-works"
          onClick={() => trackCta("how_it_works")}
          className="rounded-lg border border-zinc-700 px-8 py-3.5 font-medium text-zinc-300 transition hover:border-zinc-500"
        >
          작동 방식
        </a>
      </div>
    </section>
  );
}