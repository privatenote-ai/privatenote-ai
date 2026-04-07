import { ApiRequestError } from "@/lib/queryClient";

export function isForbiddenApiError(error: unknown): boolean {
  if (error instanceof ApiRequestError && error.status === 403) return true;
  const message = error instanceof Error ? error.message : "";
  return message.startsWith("403");
}
