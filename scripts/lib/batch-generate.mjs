import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runAgentCycle } from "./agent-cycle.mjs";

const SOCIAL_HOOKS = [
  "🔥 {topic} — 지금 바로 확인하세요",
  "💡 {topic}에 대한 핵심 인사이트",
  "📈 마케터라면 알아야 할: {topic}",
];

function slugify(text) {
  return text
    .slice(0, 40)
    .replace(/[^\w가-힣]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function mockSocial(topic, index) {
  const hook = SOCIAL_HOOKS[index % SOCIAL_HOOKS.length].replace("{topic}", topic);
  return {
    title: hook,
    body_md: `${hook}\n\n#AIMarketing #콘텐츠자동화\n\n자세히 보기 → 링크`,
    meta: { channel: "x", char_count: 280 },
  };
}

function mockEmail(topic, seq) {
  return {
    title: `[Nurture ${seq}] ${topic}`,
    body_md: `안녕하세요,\n\n오늘은 **${topic}**에 대해 공유드립니다.\n\n## 핵심 요약\n- AI 에이전트가 초안을 생성합니다\n- 운영자는 승인만 합니다\n- VPS에서 24/7 실행됩니다\n\n## 다음 단계\n데모를 요청하고 파일럿을 시작해 보세요.\n\n감사합니다,\nAI Marketing Team`,
    meta: { sequence: seq, type: "nurture" },
  };
}

function saveMarkdown(dir, filename, body) {
  const full = resolve(process.cwd(), "content", dir);
  mkdirSync(full, { recursive: true });
  writeFileSync(resolve(full, filename), body, "utf8");
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 * @param {Record<string, string>} env
 * @param {{ blogCount?: number; socialPerTopic?: number; emailCount?: number }} opts
 */
export async function runBatchGenerate(sb, env, opts = {}) {
  const raw = readFileSync(resolve(process.cwd(), "content/topics.json"), "utf8");
  const { topics } = JSON.parse(raw);
  const blogCount = opts.blogCount ?? 8;
  const socialPerTopic = opts.socialPerTopic ?? 2;
  const emailCount = opts.emailCount ?? 6;

  const stats = { blog: 0, social: 0, email: 0, files: 0 };

  for (let i = 0; i < Math.min(blogCount, topics.length); i++) {
    const topic = topics[i];
    const result = await runAgentCycle(sb, env, topic);
    saveMarkdown("blog", `${slugify(topic)}.md`, `# ${result.title}\n\nTopic: ${topic}\n`);
    stats.blog += 1;
    stats.files += 1;
  }

  for (const topic of topics) {
    for (let s = 0; s < socialPerTopic; s++) {
      const draft = mockSocial(topic, s);
      const { data, error } = await sb
        .from("content_calendar")
        .insert({
          title: draft.title,
          type: "social",
          status: "pending_review",
          body_md: draft.body_md,
          topic,
          meta_json: { ...draft.meta, pipeline: "batch-social" },
        })
        .select("id")
        .single();
      if (error) throw new Error(`social insert: ${error.message}`);
      await sb.from("approvals").insert({ content_id: data.id, status: "pending" });
      saveMarkdown("social", `${slugify(topic)}-${s + 1}.md`, draft.body_md);
      stats.social += 1;
      stats.files += 1;
    }
  }

  for (let i = 0; i < Math.min(emailCount, topics.length); i++) {
    const topic = topics[i];
    const draft = mockEmail(topic, i + 1);
    const { data, error } = await sb
      .from("content_calendar")
      .insert({
        title: draft.title,
        type: "email",
        status: "pending_review",
        body_md: draft.body_md,
        topic,
        meta_json: { ...draft.meta, pipeline: "batch-email" },
      })
      .select("id")
      .single();
    if (error) throw new Error(`email insert: ${error.message}`);
    await sb.from("approvals").insert({ content_id: data.id, status: "pending" });
    saveMarkdown("email", `nurture-${i + 1}-${slugify(topic)}.md`, draft.body_md);
    stats.email += 1;
    stats.files += 1;
  }

  return stats;
}