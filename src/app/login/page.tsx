import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="관리자 로그인"
      subtitle="이메일과 비밀번호로 마케팅 대시보드에 접속합니다."
      footer="이메일 로그인만 지원합니다."
    >
      <Suspense fallback={<p className="text-zinc-500">폼 로딩 중...</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}