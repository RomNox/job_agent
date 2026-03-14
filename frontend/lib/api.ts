import {
  applicationPackageSchema,
  parsedJobSchema,
} from "@/lib/schemas";
import type {
  ApplicationPackageResponse,
  ParsedJobResponse,
  PrepareApplicationPayload,
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function parseJob(url: string): Promise<ParsedJobResponse> {
  return request("/api/v1/jobs/parse", { url }, parsedJobSchema);
}

export async function prepareApplication(
  payload: PrepareApplicationPayload,
): Promise<ApplicationPackageResponse> {
  return request(
    "/api/v1/applications/prepare",
    payload,
    applicationPackageSchema,
  );
}

async function request<T>(
  path: string,
  body: unknown,
  schema: { parse: (data: unknown) => T },
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && "detail" in payload
        ? payload.detail
        : null;
    throw new Error(
      typeof detail === "string"
        ? detail
        : `Request failed with status ${response.status}.`,
    );
  }

  return schema.parse(payload);
}
