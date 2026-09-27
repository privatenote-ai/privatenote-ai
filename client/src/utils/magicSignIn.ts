import { apiRequest } from "@/lib/queryClient";

export async function prepareMagicSignIn(token: string): Promise<{
  emailCodeAvailable: boolean;
  emailCodeRequired: boolean;
  oneTapAllowed: boolean;
  riskLevel?: string;
}> {
  const prep = await apiRequest<{
    ok?: boolean;
    emailCodeAvailable?: boolean;
    emailCodeRequired?: boolean;
    oneTapAllowed?: boolean;
    riskLevel?: string;
  }>("/api/auth/magic/prepare", "POST", { token });
  return {
    emailCodeAvailable: prep?.emailCodeAvailable === true || prep?.emailCodeRequired === true,
    emailCodeRequired: prep?.emailCodeRequired === true,
    oneTapAllowed: prep?.oneTapAllowed === true,
    riskLevel: prep?.riskLevel,
  };
}

export async function consumeMagicSignIn(
  token: string,
  emailCode?: string,
): Promise<{ totpRequired?: boolean }> {
  const payload: { token: string; emailCode?: string } = { token };
  if (emailCode) {
    payload.emailCode = emailCode.replace(/\D/g, "").slice(0, 6);
  }
  return apiRequest<{ ok: boolean; totpRequired?: boolean }>(
    "/api/auth/magic/consume",
    "POST",
    payload,
  );
}

export async function finishMagicSignIn(
  token: string,
  options: { emailCode?: string } = {},
): Promise<{ totpRequired?: boolean; emailCodeRequired?: boolean }> {
  const prep = await prepareMagicSignIn(token);
  if (prep.emailCodeRequired) {
    const digits = options.emailCode?.replace(/\D/g, "") ?? "";
    if (digits.length !== 6) {
      const err = new Error("Enter the 6-digit code from your email.");
      (err as Error & { code?: string }).code = "magic_email_code_required";
      throw err;
    }
  }
  const result = await consumeMagicSignIn(
    token,
    prep.emailCodeRequired ? options.emailCode : undefined,
  );
  return { ...result, emailCodeRequired: prep.emailCodeRequired };
}
