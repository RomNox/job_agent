import {
  applicationPackageSchema,
  authStatusSchema,
  authUserSchema,
  candidateProfileResponseSchema,
  jobSearchResponseSchema,
  onboardingStateSchema,
  parsedJobSchema,
  resolvedJobContentSchema,
} from "@/lib/schemas";
import type {
  ApplicationPackageResponse,
  AuthStatusResponse,
  AuthUserResponse,
  CandidateProfileResponse,
  LoginPayload,
  JobSearchResponse,
  OnboardingStateResponse,
  ParsedJobResponse,
  PrepareApplicationPayload,
  RegisterPayload,
  ResolvedJobContent,
  SearchSelectedJobPayload,
  SearchJobsPayload,
  UpdateOnboardingStatePayload,
  UpsertCandidateProfilePayload,
} from "@/types/api";

const LOCAL_API_PORT = "8000";
const CONFIGURED_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || null;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiErrorMessageOptions = {
  fallback: string;
  network?: string;
  unauthorized?: string;
  conflict?: string;
};

export function getApiBaseUrl(): string {
  if (CONFIGURED_API_BASE_URL) {
    return CONFIGURED_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:${LOCAL_API_PORT}`;
  }

  return `http://localhost:${LOCAL_API_PORT}`;
}

export function getApiErrorMessage(
  error: unknown,
  options: ApiErrorMessageOptions,
): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return options.network ?? options.fallback;
    }
    if (error.status === 401 && options.unauthorized) {
      return options.unauthorized;
    }
    if (error.status === 409 && options.conflict) {
      return options.conflict;
    }

    return error.message || options.fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return options.fallback;
}

export async function parseJob(url: string): Promise<ParsedJobResponse> {
  return requestJson(
    "/api/v1/jobs/parse",
    { method: "POST", body: { url } },
    parsedJobSchema,
  );
}

export async function prepareApplication(
  payload: PrepareApplicationPayload,
): Promise<ApplicationPackageResponse> {
  return requestJson(
    "/api/v1/applications/prepare",
    { method: "POST", body: payload },
    applicationPackageSchema,
  );
}

export async function searchJobs(
  payload: SearchJobsPayload,
): Promise<JobSearchResponse> {
  return requestJson(
    "/api/v1/search/jobs",
    { method: "POST", body: payload },
    jobSearchResponseSchema,
  );
}

export async function resolveSearchJob(
  payload: SearchSelectedJobPayload,
): Promise<ResolvedJobContent> {
  return requestJson(
    "/api/v1/search/resolve-job",
    { method: "POST", body: payload },
    resolvedJobContentSchema,
  );
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthUserResponse> {
  return requestJson(
    "/api/v1/auth/register",
    { method: "POST", body: payload },
    authUserSchema,
  );
}

export async function loginUser(payload: LoginPayload): Promise<AuthUserResponse> {
  return requestJson(
    "/api/v1/auth/login",
    { method: "POST", body: payload },
    authUserSchema,
  );
}

export async function logoutUser(): Promise<AuthStatusResponse> {
  return requestJson(
    "/api/v1/auth/logout",
    { method: "POST" },
    authStatusSchema,
  );
}

export async function getCurrentUser(): Promise<AuthUserResponse> {
  return requestJson("/api/v1/auth/me", { method: "GET" }, authUserSchema);
}

export async function getCandidateProfile(): Promise<CandidateProfileResponse> {
  return requestJson(
    "/api/v1/profile",
    { method: "GET" },
    candidateProfileResponseSchema,
  );
}

export async function upsertCandidateProfile(
  payload: UpsertCandidateProfilePayload,
): Promise<CandidateProfileResponse> {
  return requestJson(
    "/api/v1/profile",
    { method: "PUT", body: payload },
    candidateProfileResponseSchema,
  );
}

export async function getOnboardingState(): Promise<OnboardingStateResponse> {
  return requestJson(
    "/api/v1/onboarding",
    { method: "GET" },
    onboardingStateSchema,
  );
}

export async function updateOnboardingState(
  payload: UpdateOnboardingStatePayload,
): Promise<OnboardingStateResponse> {
  return requestJson(
    "/api/v1/onboarding",
    { method: "PUT", body: payload },
    onboardingStateSchema,
  );
}

export async function requestJson<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT";
    body?: unknown;
  },
  schema: { parse: (data: unknown) => T },
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method ?? "POST",
      headers:
        options.body === undefined
          ? undefined
          : {
              "Content-Type": "application/json",
            },
      body:
        options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
      cache: "no-store",
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      0,
      "Unable to reach the backend. Check that the API server is running.",
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && "detail" in payload
        ? payload.detail
        : null;
    throw new ApiError(
      response.status,
      typeof detail === "string"
        ? detail
        : `Request failed with status ${response.status}.`,
    );
  }

  return schema.parse(payload);
}
