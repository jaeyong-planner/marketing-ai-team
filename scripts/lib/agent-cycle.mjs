/**
 * Standalone Researcher→Writer cycle (VPS / CLI, no Next.js).
 * Mirrors src/lib/agents/pipeline.ts mock path.
 */

function useMock(env) {
  return (
    env.AGENT_MOCK === "true" ||
    env.AGENT_MOCK === "1" ||
    !env.OPENAI_API_KEY ||
    String(env.OPENAI_API_KEY).includes("your-key")
  );
}

function mockResearch(topic) {
  return {
    summary: `${topic}에 대한 리서치 요약. AI 마케팅 자동화와 인간 승인 게이트의 조합이 핵심입니다.`,
    keywords: [topic.slice(0, 20), "AI 마케팅", "콘텐츠 자동화"],
    angles: ["비용 절감", "24시간 운영", "품질 통제"],
    sources: ["내부 PRD", "AI-Team-Architecture.md"],
  };
}

function mockWriter(topic, research) {
  return {
    title: `${topic} — AI 마케팅 팀 가이드`,
    body_md: `## 개요\n\n${research.summary}\n\n## 핵심 포인트\n\n${research.angles.map((a) => `- ${a}`).join("\n")}`,
    meta: { keywords: research.keywords, excerpt: research.summary.slice(0, 120) },
  };
}

async function callOpenAI(env, system, user) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "{}";
}

async function runResearcher(env, topic) {
  if (useMock(env)) return mockResearch(topic);
  const raw = await callOpenAI(
    env,
    "You are a marketing researcher. Respond with valid JSON only: summary, keywords[], angles[], sources[]. Korean content.",
    `Research topic: ${topic}`,
  );
  return JSON.parse(raw);
}

async function runWriter(env, topic, research) {
  if (useMock(env)) return mockWriter(topic, research);
  const raw = await callOpenAI(
    env,
    "You are a marketing writer. Respond with valid JSON only: title, body_md (markdown Korean), meta {keywords[], excerpt}.",
    `Topic: ${topic}\nResearch: ${JSON.stringify(research)}`,
  );
  return JSON.parse(raw);
}

async function startRun(sb, role, input) {
  const { data, error } = await sb
    .from("agent_runs")
    .insert({ agent_role: role, input, status: "running" })
    .select("id")
    .single();
  if (error) throw new Error(`${role} run start failed: ${error.message}`);
  return data.id;
}

async function finishRun(sb, id, status, output, startedAt, errorMessage) {
  await sb
    .from("agent_runs")
    .update({
      status,
      output,
      error_message: errorMessage ?? null,
      duration_ms: Date.now() - startedAt,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 * @param {Record<string, string>} env
 * @param {string} topic
 */
export async function runAgentCycle(sb, env, topic) {
  const trimmed = topic.trim();
  if (!trimmed) throw new Error("Topic is required");

  const researcherStarted = Date.now();
  const researcherRunId = await startRun(sb, "researcher", { topic: trimmed });

  let research;
  try {
    research = await runResearcher(env, trimmed);
    await finishRun(sb, researcherRunId, "completed", research, researcherStarted);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Research failed";
    await finishRun(sb, researcherRunId, "failed", null, researcherStarted, msg);
    throw err;
  }

  const writerStarted = Date.now();
  const writerRunId = await startRun(sb, "writer", { topic: trimmed, research });

  let draft;
  try {
    draft = await runWriter(env, trimmed, research);
    await finishRun(sb, writerRunId, "completed", draft, writerStarted);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Write failed";
    await finishRun(sb, writerRunId, "failed", null, writerStarted, msg);
    throw err;
  }

  const { data: content, error: contentError } = await sb
    .from("content_calendar")
    .insert({
      title: draft.title,
      type: "blog",
      status: "pending_review",
      body_md: draft.body_md,
      topic: trimmed,
      agent_run_id: writerRunId,
      meta_json: {
        research,
        writer_meta: draft.meta,
        pipeline: "researcher→writer",
        source: "vps-scheduler",
      },
    })
    .select("id")
    .single();

  if (contentError) {
    throw new Error(`Content insert failed: ${contentError.message}`);
  }

  const { error: approvalError } = await sb.from("approvals").insert({
    content_id: content.id,
    status: "pending",
  });

  if (approvalError) {
    throw new Error(`Approval insert failed: ${approvalError.message}`);
  }

  return {
    contentId: content.id,
    researcherRunId,
    writerRunId,
    title: draft.title,
    status: "pending_review",
  };
}