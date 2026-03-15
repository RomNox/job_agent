import {
  ApiError,
  getCurrentUser as getCurrentUserRequest,
  loginUser,
  logoutUser as logoutUserRequest,
  registerUser,
} from "@/lib/api";
import type {
  AuthStatusResponse,
  AuthUserResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/api";

export async function register(payload: RegisterPayload): Promise<AuthUserResponse> {
  return registerUser(payload);
}

export async function login(payload: LoginPayload): Promise<AuthUserResponse> {
  return loginUser(payload);
}

export async function logout(): Promise<AuthStatusResponse> {
  return logoutUserRequest();
}

export async function getCurrentUser(): Promise<AuthUserResponse> {
  return getCurrentUserRequest();
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function getAuthErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return error.message;
    }

    if (error.status >= 500) {
      return fallbackMessage;
    }

    return error.message;
  }

  return fallbackMessage;
}

export function getOptionalSafeNextPath(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim();
  if (!normalized) {
    return null;
  }

  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return null;
  }

  try {
    const baseUrl = new URL("http://job-agent.local");
    const parsed = new URL(normalized, baseUrl);
    if (parsed.origin !== baseUrl.origin) {
      return null;
    }

    if (parsed.pathname === "/login" || parsed.pathname === "/signup") {
      return null;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function getSafeNextPath(value: string | null | undefined): string {
  return getOptionalSafeNextPath(value) ?? "/workspace";
}

export { ApiError };
