"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage, getOnboardingState } from "@/lib/api";
import { getOptionalSafeNextPath } from "@/lib/auth";
import { buildOnboardingPath, buildSetupFlowPath } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import type { OnboardingStateResponse } from "@/types/api";

type SetupFlowScreenProps = {
  initialStep: number;
  nextPath?: string;
};

type SetupStepView = {
  key: number;
  title: string;
  description: readonly string[];
  body: ReactNode;
};

const FLOW_TRANSITION_DURATION_MS = 1000;
const FLOW_TRANSITION_SETTLE_DELAY_MS = FLOW_TRANSITION_DURATION_MS + 40;

export function SetupFlowScreen({
  initialStep,
  nextPath,
}: SetupFlowScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { messages, t } = useI18n();
  const flow = messages.setupFlow;
  const safeNextPath = getOptionalSafeNextPath(nextPath);
  const stepCount = flow.steps.length;
  const previousStepRef = useRef(clampStep(initialStep, stepCount));

  const [currentStep, setCurrentStep] = useState(clampStep(initialStep, stepCount));
  const [onboardingState, setOnboardingState] =
    useState<OnboardingStateResponse | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const normalizedStep = clampStep(initialStep, stepCount);
    setCurrentStep(normalizedStep);
    previousStepRef.current = normalizedStep;
  }, [initialStep, stepCount]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isActive = true;
    setIsLoadingState(true);
    setErrorMessage(null);

    void (async () => {
      try {
        const state = await getOnboardingState();
        if (!isActive) {
          return;
        }

        setOnboardingState(state);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(error, {
            fallback: flow.loadError,
            network: t("auth.errors.backendUnavailable"),
          }),
        );
      } finally {
        if (!isActive) {
          return;
        }

        setIsLoadingState(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [flow.loadError, t, user?.id]);

  const isResumeCreated = onboardingState?.completed ?? false;
  const transitionDirection =
    currentStep >= previousStepRef.current ? "forward" : "backward";
  const isChecklistStep = currentStep === 1;
  const isLastStep = currentStep === stepCount - 1;
  const isContinueDisabled =
    isChecklistStep && (!isResumeCreated || isLoadingState);

  useEffect(() => {
    previousStepRef.current = currentStep;
  }, [currentStep]);

  const stepView: SetupStepView = {
    key: currentStep,
    title: flow.steps[currentStep]?.title ?? flow.steps[0].title,
    description:
      flow.steps[currentStep]?.description ?? flow.steps[0].description,
    body: renderStepBody({
      currentStep,
      errorMessage,
      flow,
      isLoadingState,
      isResumeCreated,
      onRetry: () => {
        setIsLoadingState(true);
        setErrorMessage(null);
        void (async () => {
          try {
            const state = await getOnboardingState();
            setOnboardingState(state);
          } catch (error) {
            setErrorMessage(
              getApiErrorMessage(error, {
                fallback: flow.loadError,
                network: t("auth.errors.backendUnavailable"),
              }),
            );
          } finally {
            setIsLoadingState(false);
          }
        })();
      },
      onOpenOnboarding: () => {
        const returnPath = buildSetupFlowPath(safeNextPath, 1);
        router.push(buildOnboardingPath(returnPath));
      },
    }),
  };

  function handleSelectStep(nextStep: number) {
    const normalizedStep = clampStep(nextStep, stepCount);
    setCurrentStep(normalizedStep);
    router.replace(buildSetupFlowPath(safeNextPath, normalizedStep), {
      scroll: false,
    });
  }

  function handleContinue() {
    if (isContinueDisabled) {
      return;
    }

    if (isLastStep) {
      router.push(safeNextPath ?? "/workspace");
      return;
    }

    handleSelectStep(currentStep + 1);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-3.5">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 sm:inline-flex">
              {user?.full_name ?? t("common.states.account")}
            </span>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <section className="w-full max-w-4xl text-center">
            <ContentTransition
              view={stepView}
              direction={transitionDirection}
            />

            <HorizontalTimeline
              className="mt-10"
              currentStep={currentStep}
              steps={flow.steps}
              onSelectStep={handleSelectStep}
            />

            <div className="mt-8 flex flex-col items-center gap-3">
              <Button
                type="button"
                onClick={handleContinue}
                disabled={isContinueDisabled}
                className="min-w-[168px]"
              >
                {isLastStep ? flow.actions.openAssistant : flow.actions.continue}
              </Button>
              {isChecklistStep && isContinueDisabled ? (
                <p className="text-sm text-slate-500">
                  {flow.checklist.continueLocked}
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function renderStepBody({
  currentStep,
  errorMessage,
  flow,
  isLoadingState,
  isResumeCreated,
  onRetry,
  onOpenOnboarding,
}: {
  currentStep: number;
  errorMessage: string | null;
  flow: ReturnType<typeof useI18n>["messages"]["setupFlow"];
  isLoadingState: boolean;
  isResumeCreated: boolean;
  onRetry: () => void;
  onOpenOnboarding: () => void;
}) {
  if (currentStep !== 1) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-slate-50 px-5 py-5 text-left sm:px-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          {flow.checklist.title}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          {flow.checklist.description}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenOnboarding}
        className={cn(
          "mt-5 flex w-full items-center gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition-colors duration-300",
          isResumeCreated
            ? "border-emerald-200 bg-emerald-50 text-emerald-950"
            : "border-slate-200 bg-white text-slate-950 hover:border-slate-300",
        )}
      >
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300",
            isResumeCreated
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 bg-white text-transparent",
          )}
        >
          ✓
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {flow.checklist.items.createResume}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              isResumeCreated ? "text-emerald-800" : "text-slate-500",
            )}
          >
            {isResumeCreated
              ? flow.checklist.completed
              : flow.checklist.pending}
          </p>
        </div>
      </button>

      {isLoadingState ? (
        <p className="mt-4 text-sm text-slate-500">{flow.loading}</p>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 font-semibold text-red-800 underline underline-offset-4"
          >
            {flow.actions.retry}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function HorizontalTimeline({
  currentStep,
  steps,
  onSelectStep,
  className,
}: {
  currentStep: number;
  steps: readonly {
    label: string;
  }[];
  onSelectStep: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto pb-2", className)}>
      <div className="mx-auto min-w-[18rem] max-w-3xl px-4">
        <div className="relative grid grid-cols-3 gap-3 sm:gap-6">
          <div className="pointer-events-none absolute left-6 right-6 top-2 h-px bg-[linear-gradient(to_right,rgba(255,255,255,0),rgba(148,163,184,0.32)_12%,rgba(148,163,184,0.42)_50%,rgba(148,163,184,0.32)_88%,rgba(255,255,255,0))]" />
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <button
                key={`${step.label}-${index}`}
                type="button"
                onClick={() => onSelectStep(index)}
                aria-current={isCurrent ? "step" : undefined}
                className="group relative flex flex-col items-center gap-4 pt-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/80 focus-visible:ring-offset-2"
              >
                <span
                  className={cn(
                    "relative z-10 flex h-4 w-4 items-center justify-center rounded-full border bg-white transition-all duration-300",
                    isCurrent &&
                      "border-slate-900 bg-slate-900 shadow-[0_0_0_4px_rgba(15,23,42,0.08)]",
                    isCompleted && "border-slate-700 bg-slate-700",
                    !isCurrent &&
                      !isCompleted &&
                      "border-slate-300 group-hover:border-slate-400",
                  )}
                />
                <span
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isCurrent
                      ? "font-semibold text-slate-950"
                      : isCompleted
                        ? "font-medium text-slate-700"
                        : "font-medium text-slate-500 group-hover:text-slate-700",
                  )}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContentTransition({
  view,
  direction,
}: {
  view: SetupStepView;
  direction: "forward" | "backward";
}) {
  const [displayedView, setDisplayedView] = useState(view);
  const [outgoingView, setOutgoingView] = useState<SetupStepView | null>(null);
  const [phase, setPhase] = useState<"idle" | "preparing" | "animating">("idle");
  const [activeDirection, setActiveDirection] = useState(direction);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [observedPanel, setObservedPanel] = useState<HTMLDivElement | null>(null);
  const activePanelRef = useRef<HTMLDivElement | null>(null);
  const displayedViewRef = useRef(view);
  const animationFrameRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);
  const isTransitioning = phase !== "idle";

  useEffect(() => {
    displayedViewRef.current = displayedView;
  }, [displayedView]);

  useEffect(() => {
    const currentView = displayedViewRef.current;
    if (view.key === currentView.key) {
      setDisplayedView(view);
      return;
    }

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
    }

    setActiveDirection(direction);
    setOutgoingView(currentView);
    setContainerHeight(activePanelRef.current?.offsetHeight ?? containerHeight);
    setDisplayedView(view);
    setPhase("preparing");

    animationFrameRef.current = window.requestAnimationFrame(() => {
      setPhase("animating");
    });

    settleTimeoutRef.current = window.setTimeout(() => {
      setOutgoingView(null);
      setPhase("idle");
    }, FLOW_TRANSITION_SETTLE_DELAY_MS);
  }, [view, direction, containerHeight]);

  useEffect(() => {
    if (!observedPanel) {
      return;
    }

    const updateHeight = () => {
      setContainerHeight(observedPanel.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(observedPanel);

    return () => {
      observer.disconnect();
    };
  }, [observedPanel]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (settleTimeoutRef.current !== null) {
        window.clearTimeout(settleTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-[height] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        isTransitioning && "pointer-events-none",
      )}
      style={containerHeight ? { height: `${containerHeight}px` } : undefined}
    >
      {outgoingView ? (
        <ContentPanel
          key={`outgoing-${outgoingView.key}`}
          view={outgoingView}
          className={cn(
            "absolute inset-0 w-full transform-gpu transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            phase === "preparing" && "translate-x-0 opacity-100 blur-0",
            phase === "animating" &&
              (activeDirection === "forward"
                ? "-translate-x-[12%] opacity-0 blur-[3px]"
                : "translate-x-[12%] opacity-0 blur-[3px]"),
          )}
        />
      ) : null}

      <ContentPanel
        key={`active-${displayedView.key}`}
        panelRef={(node) => {
          activePanelRef.current = node;
          setObservedPanel(node);
        }}
        view={displayedView}
        className={cn(
          "relative w-full transform-gpu transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          phase === "idle" && "translate-x-0 opacity-100 blur-0",
          phase === "preparing" &&
            (activeDirection === "forward"
              ? "translate-x-[12%] opacity-0 blur-[3px]"
              : "-translate-x-[12%] opacity-0 blur-[3px]"),
          phase === "animating" && "translate-x-0 opacity-100 blur-0",
        )}
      />
    </div>
  );
}

function ContentPanel({
  view,
  className,
  panelRef,
}: {
  view: SetupStepView;
  className?: string;
  panelRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={panelRef}
      className={cn("space-y-6", className)}
    >
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {view.title}
        </h1>
        <div className="mx-auto max-w-2xl space-y-3 text-base leading-7 text-slate-600 sm:text-lg">
          {view.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      {view.body}
    </div>
  );
}

function clampStep(value: number, total: number) {
  if (!Number.isFinite(value) || total <= 0) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(value), 0), total - 1);
}
