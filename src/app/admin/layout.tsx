import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/leads", label: "리드" },
  { href: "/admin/approvals", label: "승인" },
  { href: "/admin/content", label: "콘텐츠" },
  { href: "/admin/analytics", label: "KPI" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold text-cyan-400">
              Admin
            </Link>
            <nav className="flex gap-4 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-zinc-400 transition hover:text-zinc-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:border-zinc-500"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}