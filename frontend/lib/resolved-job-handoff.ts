import { resolvedJobContentSchema } from "@/lib/schemas";
import type { ResolvedJobContent } from "@/types/api";

const STORAGE_PREFIX = "job-agent:resolved-job:";

export function storeResolvedJobContent(content: ResolvedJobContent): string {
  const handoffKey =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`;

  sessionStorage.setItem(
    buildStorageKey(handoffKey),
    JSON.stringify(content),
  );
  return handoffKey;
}

export function consumeResolvedJobContent(
  handoffKey: string,
): ResolvedJobContent | null {
  const storageKey = buildStorageKey(handoffKey);
  const rawValue = sessionStorage.getItem(storageKey);
  if (!rawValue) {
    return null;
  }

  try {
    return resolvedJobContentSchema.parse(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

function buildStorageKey(handoffKey: string) {
  return `${STORAGE_PREFIX}${handoffKey}`;
}
