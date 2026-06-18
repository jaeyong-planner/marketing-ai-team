import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="관리자 회원가입"
      subtitle="첫 관리자 계정을 생성하면 profiles 테이블에 자동 등록됩니다."
      footer="가입 후 /admin 대시보드로 이동합니다."
    >
      <SignupForm />
    </AuthShell>
  );
}