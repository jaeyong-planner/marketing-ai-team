import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { TrackingScripts } from "@/components/analytics/tracking-scripts";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "AI Marketing Team — 승인만 하면 24시간 콘텐츠",
  description:
    "Hermes 스타일 AI 마케팅 팀. 연구·작성·배포 준비를 자동화하고, 인간은 승인만 합니다.",
  openGraph: {
    title: "AI Marketing Team",
    description: "24시간 AI 콘텐츠 팀 + 풀 퍼널 런칭",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">
        {gtmId ? (
          <noscript>
            <iframe
              title="gtm"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <TrackingScripts gtmId={gtmId} metaPixelId={metaPixelId} />
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}