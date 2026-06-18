import { formatForChannel, resolveChannel } from "@/lib/agents/formats";
import { getServiceSupabase } from "@/lib/supabase/service";
import type { ContentStatus, ContentType } from "@/types/database";

const PUBLISHABLE: ContentStatus[] = ["approved", "scheduled"];

export async function publishContent(contentId: string, channel = "blog") {
  const sb = getServiceSupabase();

  const { data: content, error: fetchError } = await sb
    .from("content_calendar")
    .select("id, status, title, body_md, type")
    .eq("id", contentId)
    .single();

  if (fetchError || !content) {
    throw new Error("Content not found");
  }

  if (!PUBLISHABLE.includes(content.status as ContentStatus)) {
    throw new Error(
      `Publish blocked: status is "${content.status}". Approve first.`,
    );
  }

  const started = Date.now();
  const { data: run, error: runError } = await sb
    .from("agent_runs")
    .insert({
      agent_role: "publisher",
      input: { content_id: contentId, channel },
      status: "running",
    })
    .select("id")
    .single();

  if (runError) throw new Error(runError.message);

  const resolvedChannel = resolveChannel(content.type as ContentType, channel);
  const { formatted, metadata } = formatForChannel(
    content.type as ContentType,
    content.title,
    content.body_md ?? "",
    resolvedChannel,
  );

  const placeholderUrl = `https://marketing-ai-team.local/${resolvedChannel}/${contentId.slice(0, 8)}`;

  const { error: postError } = await sb.from("published_posts").insert({
    content_id: contentId,
    channel: resolvedChannel,
    url: placeholderUrl,
    published_at: new Date().toISOString(),
    metadata: { formatted_preview: formatted.slice(0, 500), ...metadata },
  });

  if (postError) {
    await sb
      .from("agent_runs")
      .update({
        status: "failed",
        error_message: postError.message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
    throw new Error(postError.message);
  }

  await sb
    .from("content_calendar")
    .update({ status: "published" })
    .eq("id", contentId);

  await sb
    .from("agent_runs")
    .update({
      status: "completed",
      output: { url: placeholderUrl, channel: resolvedChannel, formatted_length: formatted.length },
      duration_ms: Date.now() - started,
      completed_at: new Date().toISOString(),
    })
    .eq("id", run.id);

  return { url: placeholderUrl, channel };
}