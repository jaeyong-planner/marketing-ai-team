import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="mb-8 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
      >
        ← 홈으로
      </Link>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-8 text-zinc-400">{subtitle}</p>
      {children}
      <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
    </main>
  );
}