export type AnalyticsEventType =
  | "page_view"
  | "lead_submit"
  | "cta_click";

type EventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function pushDataLayer(event: AnalyticsEventType, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}

export function trackMeta(event: AnalyticsEventType, payload: EventPayload = {}) {
  if (typeof window === "undefined" || !window.fbq) return;
  const metaEvent = event === "lead_submit" ? "Lead" : "ViewContent";
  window.fbq("track", metaEvent, payload);
}

export async function trackServer(
  eventType: AnalyticsEventType,
  payload: EventPayload = {},
  sessionId?: string,
) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType, payload, session_id: sessionId }),
    });
  } catch {
    /* non-blocking */
  }
}