const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  user_already_exists: "이미 가입된 이메일입니다. 로그인해 주세요.",
  weak_password: "비밀번호는 8자 이상이어야 합니다.",
  email_not_confirmed: "이메일 인증이 필요합니다. 메일함을 확인해 주세요.",
};

export function getAuthErrorMessage(error: { message: string }): string {
  const normalized = error.message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return AUTH_ERROR_MESSAGES.invalid_credentials;
  }
  if (normalized.includes("already registered")) {
    return AUTH_ERROR_MESSAGES.user_already_exists;
  }
  if (normalized.includes("password")) {
    return AUTH_ERROR_MESSAGES.weak_password;
  }
  if (normalized.includes("email not confirmed")) {
    return AUTH_ERROR_MESSAGES.email_not_confirmed;
  }

  return error.message;
}