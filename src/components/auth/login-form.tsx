"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/messages";
import { AuthField } from "@/components/auth/auth-field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(getAuthErrorMessage(signInError));
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthField
        label="이메일"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="admin@example.com"
      />
      <AuthField
        label="비밀번호"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="8자 이상"
      />
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
      <p className="text-center text-sm text-zinc-500">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
          회원가입
        </Link>
      </p>
    </form>
  );
}