import type { ContentType } from "@/types/database";

export function formatForChannel(
  type: ContentType,
  title: string,
  bodyMd: string,
  channel: string,
): { formatted: string; metadata: Record<string, unknown> } {
  switch (channel) {
    case "x":
    case "twitter":
      return {
        formatted: `${title}\n\n${bodyMd.replace(/^#+\s/gm, "").slice(0, 240)}…`,
        metadata: { max_length: 280, platform: "x" },
      };
    case "email":
      return {
        formatted: `Subject: ${title}\n\n${bodyMd}`,
        metadata: { format: "plain+md", platform: "email" },
      };
    case "blog":
    default:
      return {
        formatted: `# ${title}\n\n${bodyMd}`,
        metadata: { format: "markdown", platform: channel || "blog" },
      };
  }
}

export function resolveChannel(contentType: ContentType, override?: string): string {
  if (override) return override;
  if (contentType === "social") return "x";
  if (contentType === "email") return "email";
  return "blog";
}