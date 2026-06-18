"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/messages";
import { AuthField } from "@/components/auth/auth-field";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError));
      return;
    }

    if (data.session) {
      router.push("/admin");
      router.refresh();
      return;
    }

    setError(
      "가입이 완료되었습니다. 이메일 인증이 필요하면 메일함을 확인한 뒤 로그인해 주세요.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthField
        label="이름"
        name="fullName"
        type="text"
        autoComplete="name"
        required
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        placeholder="홍길동"
      />
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
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="8자 이상"
      />
      {error ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            error.includes("가입이 완료")
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>
      <p className="text-center text-sm text-zinc-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
          로그인
        </Link>
      </p>
    </form>
  );
}