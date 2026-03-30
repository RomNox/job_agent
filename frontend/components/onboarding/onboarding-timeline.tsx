"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type TimelineStep = {
  id: string;
  label: string;
};

type OnboardingTimelineProps = {
  steps: readonly TimelineStep[];
  currentStep: number;
  isBusy?: boolean;
  onSelectStep?: (index: number) => void;
  className?: string;
};

export function OnboardingTimeline({
  steps,
  currentStep,
  isBusy = false,
  onSelectStep,
  className,
}: OnboardingTimelineProps) {
  const axisStyle = {
    "--timeline-axis": "0.875rem",
  } as CSSProperties;

  return (
    <div className={cn("relative", className)} style={axisStyle}>
      <div className="pointer-events-none absolute inset-y-1 left-[var(--timeline-axis)] w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(148,163,184,0.34)_10%,rgba(148,163,184,0.4)_50%,rgba(148,163,184,0.3)_90%,rgba(255,255,255,0))]" />
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status =
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "current"
                : "upcoming";
          const isCurrent = status === "current";

          return (
            <button
              key={step.id}
              type="button"
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onSelectStep?.(index)}
              disabled={isBusy}
              className={cn(
                "group relative block min-h-9 w-full pl-10 text-left transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                !isBusy && "hover:opacity-100",
              )}
            >
              <span
                className={cn(
                  "absolute left-[var(--timeline-axis)] top-4 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                )}
              >
                <span
                  className={cn(
                    "rounded-full border transition-all duration-300",
                    status === "completed" &&
                      "h-2.5 w-2.5 border-slate-700 bg-slate-700",
                    status === "current" &&
                      "h-3.5 w-3.5 border-slate-700 bg-white shadow-[0_0_0_4px_rgba(15,23,42,0.05)]",
                    status === "upcoming" &&
                      "h-2.5 w-2.5 border-slate-300 bg-white group-hover:border-slate-400",
                  )}
                />
              </span>
              <p
                className={cn(
                  "text-sm leading-8 transition-colors duration-300",
                  isCurrent
                    ? "font-semibold text-slate-900"
                    : status === "completed"
                      ? "font-medium text-slate-700"
                      : "font-medium text-slate-500 group-hover:text-slate-700",
                )}
              >
                {step.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
