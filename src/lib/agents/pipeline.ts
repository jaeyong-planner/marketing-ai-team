import { getServiceSupabase } from "@/lib/supabase/service";
import { runResearcher, runWriter } from "@/lib/agents/llm";

export type PipelineResult = {
  contentId: string;
  researcherRunId: string;
  writerRunId: string;
  title: string;
  status: "pending_review";
};

async function startRun(role: string, input: Record<string, unknown>) {
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("agent_runs")
    .insert({
      agent_role: role,
      input,
      status: "running",
    })
    .select("id")
    .single();

  if (error) throw new Error(`${role} run start failed: ${error.message}`);
  return data.id as string;
}

async function finishRun(
  id: string,
  status: "completed" | "failed",
  output: Record<string, unknown> | null,
  startedAt: number,
  errorMessage?: string,
) {
  const sb = getServiceSupabase();
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

export async function runAgentCycle(topic: string): Promise<PipelineResult> {
  const trimmed = topic.trim();
  if (!trimmed) throw new Error("Topic is required");

  const researcherStarted = Date.now();
  const researcherRunId = await startRun("researcher", { topic: trimmed });

  let research;
  try {
    research = await runResearcher(trimmed);
    await finishRun(
      researcherRunId,
      "completed",
      research as unknown as Record<string, unknown>,
      researcherStarted,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Research failed";
    await finishRun(researcherRunId, "failed", null, researcherStarted, msg);
    throw err;
  }

  const writerStarted = Date.now();
  const writerRunId = await startRun("writer", { topic: trimmed, research });

  let draft;
  try {
    draft = await runWriter(trimmed, research);
    await finishRun(
      writerRunId,
      "completed",
      draft as unknown as Record<string, unknown>,
      writerStarted,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Write failed";
    await finishRun(writerRunId, "failed", null, writerStarted, msg);
    throw err;
  }

  const sb = getServiceSupabase();
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
    contentId: content.id as string,
    researcherRunId,
    writerRunId,
    title: draft.title,
    status: "pending_review",
  };
}