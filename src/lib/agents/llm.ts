export type ResearchOutput = {
  summary: string;
  keywords: string[];
  angles: string[];
  sources: string[];
};

export type WriterOutput = {
  title: string;
  body_md: string;
  meta: { keywords: string[]; excerpt: string };
};

function useMock(): boolean {
  return (
    process.env.AGENT_MOCK === "true" ||
    process.env.AGENT_MOCK === "1" ||
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY.includes("your-key")
  );
}

export function mockResearch(topic: string): ResearchOutput {
  return {
    summary: `${topic}에 대한 리서치 요약. AI 마케팅 자동화와 인간 승인 게이트의 조합이 핵심입니다.`,
    keywords: [topic.slice(0, 20), "AI 마케팅", "콘텐츠 자동화"],
    angles: ["비용 절감", "24시간 운영", "품질 통제"],
    sources: ["내부 PRD", "AI-Team-Architecture.md"],
  };
}

export function mockWriter(topic: string, research: ResearchOutput): WriterOutput {
  return {
    title: `${topic} — AI 마케팅 팀 가이드`,
    body_md: `## 개요\n\n${research.summary}\n\n## 핵심 포인트\n\n${research.angles.map((a) => `- ${a}`).join("\n")}\n\n## 키워드\n\n${research.keywords.join(", ")}\n\n## CTA\n\n데모를 요청하고 24시간 AI 콘텐츠 팀을 경험해 보세요.`,
    meta: {
      keywords: research.keywords,
      excerpt: research.summary.slice(0, 120),
    },
  };
}

async function callOpenAI(
  system: string,
  user: string,
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
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

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "{}";
}

export async function runResearcher(topic: string): Promise<ResearchOutput> {
  if (useMock()) return mockResearch(topic);

  const raw = await callOpenAI(
    "You are a marketing researcher. Respond with valid JSON only: summary, keywords[], angles[], sources[]. Korean content.",
    `Research topic: ${topic}`,
  );
  return JSON.parse(raw) as ResearchOutput;
}

export async function runWriter(
  topic: string,
  research: ResearchOutput,
): Promise<WriterOutput> {
  if (useMock()) return mockWriter(topic, research);

  const raw = await callOpenAI(
    "You are a marketing writer. Respond with valid JSON only: title, body_md (markdown Korean), meta {keywords[], excerpt}.",
    `Topic: ${topic}\nResearch: ${JSON.stringify(research)}`,
  );
  return JSON.parse(raw) as WriterOutput;
}