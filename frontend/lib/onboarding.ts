import { getOptionalSafeNextPath } from "@/lib/auth";
import type { OnboardingStateResponse } from "@/types/api";

export const ONBOARDING_PATH = "/onboarding";
export const SETUP_FLOW_PATH = "/timeline";

export const ONBOARDING_STAGES = [
  {
    id: "welcome",
  },
  {
    id: "personal-details",
  },
  {
    id: "address",
  },
  {
    id: "work-authorization",
  },
  {
    id: "target-role",
  },
  {
    id: "work-experience",
  },
  {
    id: "education",
  },
  {
    id: "skills",
  },
  {
    id: "languages",
  },
  {
    id: "job-preferences",
  },
  {
    id: "ready",
  },
] as const;

export type OnboardingStageStatus = "locked" | "available" | "current" | "completed";

export const FINAL_ONBOARDING_STEP_INDEX = ONBOARDING_STAGES.length - 1;

export function getStageStatus(
  index: number,
  state: Pick<OnboardingStateResponse, "current_step" | "furthest_step" | "completed">,
): OnboardingStageStatus {
  if (index > state.furthest_step) {
    return "locked";
  }

  if (index === state.current_step) {
    return "current";
  }

  if (index < state.current_step) {
    return "completed";
  }

  return "available";
}

export function buildOnboardingPath(rawNextPath?: string | null): string {
  const nextPath = getOptionalSafeNextPath(rawNextPath);
  if (!nextPath) {
    return ONBOARDING_PATH;
  }

  if (isPathname(nextPath, ONBOARDING_PATH)) {
    return nextPath;
  }

  return `${ONBOARDING_PATH}?next=${encodeURIComponent(nextPath)}`;
}

export function buildSetupFlowPath(
  rawNextPath?: string | null,
  step?: number,
): string {
  const nextPath = getOptionalSafeNextPath(rawNextPath);

  if (nextPath && isPathname(nextPath, SETUP_FLOW_PATH)) {
    return updateStepParam(nextPath, step);
  }

  const params = new URLSearchParams();

  if (step !== undefined) {
    params.set("step", String(Math.max(step, 0)));
  }

  if (nextPath) {
    params.set("next", nextPath);
  }

  const queryString = params.toString();
  return queryString ? `${SETUP_FLOW_PATH}?${queryString}` : SETUP_FLOW_PATH;
}

export function getPostSignupDestination(rawNextPath?: string | null): string {
  return buildSetupFlowPath(rawNextPath);
}

export function getPostLoginDestination(
  onboardingState: OnboardingStateResponse,
  rawNextPath?: string | null,
): string {
  const nextPath = getOptionalSafeNextPath(rawNextPath);
  if (!onboardingState.completed) {
    if (nextPath && (isPathname(nextPath, ONBOARDING_PATH) || isPathname(nextPath, SETUP_FLOW_PATH))) {
      return nextPath;
    }

    return buildSetupFlowPath(nextPath);
  }

  return nextPath ?? "/workspace";
}

export function getPostOnboardingDestination(rawNextPath?: string | null): string {
  return getOptionalSafeNextPath(rawNextPath) ?? "/workspace";
}

function isPathname(path: string, targetPathname: string) {
  try {
    return new URL(path, "http://job-agent.local").pathname === targetPathname;
  } catch {
    return false;
  }
}

function updateStepParam(path: string, step?: number) {
  if (step === undefined) {
    return path;
  }

  const parsed = new URL(path, "http://job-agent.local");
  parsed.searchParams.set("step", String(Math.max(step, 0)));
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
