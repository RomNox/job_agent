import { getOptionalSafeNextPath } from "@/lib/auth";
import type { OnboardingStateResponse } from "@/types/api";

export const ONBOARDING_STAGES = [
  {
    id: "introduction",
  },
  {
    id: "career-goal",
  },
  {
    id: "basic-profile",
  },
  {
    id: "experience-skills",
  },
  {
    id: "job-preferences",
  },
  {
    id: "cv-background",
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
    return "/onboarding";
  }

  return `/onboarding?next=${encodeURIComponent(nextPath)}`;
}

export function getPostSignupDestination(rawNextPath?: string | null): string {
  return buildOnboardingPath(rawNextPath);
}

export function getPostLoginDestination(
  onboardingState: OnboardingStateResponse,
  rawNextPath?: string | null,
): string {
  const nextPath = getOptionalSafeNextPath(rawNextPath);
  if (!onboardingState.completed) {
    return buildOnboardingPath(nextPath);
  }

  return nextPath ?? "/search";
}

export function getPostOnboardingDestination(rawNextPath?: string | null): string {
  return getOptionalSafeNextPath(rawNextPath) ?? "/search";
}
