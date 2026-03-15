"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { ONBOARDING_STAGES, getStageStatus } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import type { OnboardingStateResponse } from "@/types/api";

type OnboardingTimelineProps = {
  onboardingState: Pick<
    OnboardingStateResponse,
    "current_step" | "furthest_step" | "completed"
  >;
  isBusy: boolean;
  onSelectStage: (index: number) => void;
};

export function OnboardingTimeline({
  onboardingState,
  isBusy,
  onSelectStage,
}: OnboardingTimelineProps) {
  const { messages } = useI18n();

  return (
    <div className="relative pl-10">
      <div className="absolute left-4 top-4 h-[calc(100%-16px)] w-px bg-gradient-to-b from-slate-950 via-slate-300 to-white" />
      <div className="space-y-5">
        {ONBOARDING_STAGES.map((stageMeta, index) => {
          const stage = messages.onboarding.stages[index];
          const status = getStageStatus(index, onboardingState);
          const isLocked = status === "locked";

          return (
            <button
              key={stageMeta.id}
              type="button"
              onClick={() => onSelectStage(index)}
              disabled={isLocked || isBusy}
              className={cn(
                "group relative block w-full text-left transition-opacity",
                isLocked ? "cursor-not-allowed opacity-50" : "hover:opacity-100",
              )}
            >
              <span
                className={cn(
                  "absolute -left-10 top-1.5 block rounded-full border transition-all",
                  status === "current" &&
                    "h-4 w-4 border-slate-950 bg-slate-950 shadow-[0_0_0_6px_rgba(15,23,42,0.06)]",
                  status === "completed" && "h-3 w-3 border-slate-950 bg-slate-950",
                  status === "available" && "h-3 w-3 border-slate-400 bg-white",
                  status === "locked" && "h-3 w-3 border-slate-200 bg-white",
                )}
              />
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  {stage.eyebrow}
                </p>
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    status === "current" ? "text-slate-950" : "text-slate-600",
                  )}
                >
                  {stage.title}
                </p>
                <p className="text-sm leading-6 text-slate-500">{stage.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
