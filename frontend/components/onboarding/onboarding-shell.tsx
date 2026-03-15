"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";

import { useAuth } from "@/components/auth/auth-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import {
  getApiErrorMessage,
  getCandidateProfile,
  getOnboardingState,
  upsertCandidateProfile,
  updateOnboardingState,
} from "@/lib/api";
import { getOptionalSafeNextPath } from "@/lib/auth";
import {
  FINAL_ONBOARDING_STEP_INDEX,
  getPostOnboardingDestination,
} from "@/lib/onboarding";
import {
  candidateProfileToWorkspaceValues,
  formatProfileTimestamp,
  workspaceValuesToProfilePayload,
} from "@/lib/profile";
import { createCandidateProfileFormSchema } from "@/lib/schemas";
import type {
  CandidateProfileFormValues,
  OnboardingStateResponse,
} from "@/types/api";

import { OnboardingNavigation } from "./onboarding-navigation";
import { OnboardingStageContent } from "./onboarding-stage-content";
import { OnboardingTimeline } from "./onboarding-timeline";

const defaultProfileValues: CandidateProfileFormValues = {
  full_name: "",
  email: "",
  phone: "",
  location: "",
  target_role: "",
  years_of_experience: "",
  skills: "",
  languages: "",
  work_authorization: "",
  remote_preference: "",
  preferred_locations: "",
  salary_expectation: "",
  professional_summary: "",
  cv_text: "",
};

const stageFieldMap: Record<number, readonly (keyof CandidateProfileFormValues)[]> = {
  1: ["target_role", "preferred_locations", "remote_preference"],
  2: ["full_name", "email", "phone", "location", "work_authorization"],
  3: ["years_of_experience", "skills", "languages", "professional_summary"],
  4: ["preferred_locations", "remote_preference", "salary_expectation"],
  5: ["cv_text"],
};

type OnboardingShellProps = {
  nextPath?: string;
};

export function OnboardingShell({ nextPath }: OnboardingShellProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { locale, t } = useI18n();
  const [onboardingState, setOnboardingState] =
    useState<OnboardingStateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const safeNextPath = getOptionalSafeNextPath(nextPath);
  const form = useForm<CandidateProfileFormValues>({
    resolver: zodResolver(
      createCandidateProfileFormSchema((key) => t(`validation.${key}`)),
    ),
    defaultValues: defaultProfileValues,
  });
  const currentValues = form.watch();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setErrorMessage(null);

    void (async () => {
      try {
        const [profile, state] = await Promise.all([
          getCandidateProfile(),
          getOnboardingState(),
        ]);
        if (!isActive) {
          return;
        }

        const normalizedState = normalizeOnboardingState(state);
        form.reset(candidateProfileToWorkspaceValues(profile));
        setOnboardingState(normalizedState);
        setStatusMessage(
          normalizedState.completed
            ? t("onboarding.page.completedStatus")
            : profile.updated_at
              ? t("workspace.profile.loadedProfile", {
                  timestamp:
                    formatProfileTimestamp(profile.updated_at, locale) ??
                    t("common.states.recently"),
                })
              : t("workspace.profile.noSavedProfile"),
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(error, {
            fallback: t("onboarding.page.loadError"),
            network: t("auth.errors.backendUnavailable"),
          }),
        );
      } finally {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [form, locale, reloadNonce, t, user?.id]);

  const currentStep = onboardingState?.current_step ?? 0;
  const isCompleted = onboardingState?.completed ?? false;
  const nextButtonLabel = getNextButtonLabel(currentStep, safeNextPath, t);
  const helperText =
    currentStep === FINAL_ONBOARDING_STEP_INDEX
      ? t("onboarding.page.helperFinal")
      : t("onboarding.page.helperDefault");

  async function handleSelectStage(index: number) {
    if (!onboardingState || index === onboardingState.current_step) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setIsSaving(true);

    try {
      const savedState = normalizeOnboardingState(await updateOnboardingState({
        current_step: index,
        completed: onboardingState.completed,
      }));
      setOnboardingState(savedState);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("onboarding.page.stepChangeError"),
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBack() {
    if (!onboardingState || onboardingState.current_step === 0) {
      return;
    }

    await handleSelectStage(onboardingState.current_step - 1);
  }

  async function handleNext() {
    if (!onboardingState) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);

    const isValid = await validateStage(
      currentStep,
      form,
      t("onboarding.page.targetRoleRequired"),
    );
    if (!isValid) {
      return;
    }

    setIsSaving(true);

    try {
      if (stageFieldMap[currentStep]?.length) {
        const savedProfile = await upsertCandidateProfile(
          workspaceValuesToProfilePayload(form.getValues()),
        );
        form.reset(candidateProfileToWorkspaceValues(savedProfile));
        setStatusMessage(
          savedProfile.updated_at
            ? t("workspace.profile.savedProfileAt", {
                timestamp:
                  formatProfileTimestamp(savedProfile.updated_at, locale) ??
                  t("common.states.recently"),
              })
            : t("workspace.profile.savedProfile"),
        );
      }

      if (currentStep === FINAL_ONBOARDING_STEP_INDEX) {
        const savedState = normalizeOnboardingState(await updateOnboardingState({
          current_step: FINAL_ONBOARDING_STEP_INDEX,
          completed: true,
        }));
        setOnboardingState(savedState);
        router.replace(getPostOnboardingDestination(safeNextPath));
        return;
      }

      const nextStep = Math.min(currentStep + 1, FINAL_ONBOARDING_STEP_INDEX);
      const savedState = normalizeOnboardingState(await updateOnboardingState({
        current_step: nextStep,
        completed: onboardingState.completed,
      }));
      setOnboardingState(savedState);
      setStatusMessage(
        nextStep === FINAL_ONBOARDING_STEP_INDEX
          ? t("onboarding.page.finalReviewStatus")
          : t("onboarding.page.savedStatus"),
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("onboarding.page.saveError"),
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const headerLinks = useMemo(() => {
    if (!isCompleted) {
      return [];
    }

    return [
      { href: "/search", label: t("common.navigation.search") },
      { href: "/workspace", label: t("common.navigation.workspace") },
      { href: "/profile", label: t("common.navigation.profile") },
    ];
  }, [isCompleted, t]);

  if (isLoading || !onboardingState) {
    if (!isLoading && !onboardingState) {
      return (
        <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white px-6 py-10 shadow-panel">
            <div className="space-y-3">
              <p className="text-lg font-semibold text-slate-950">
                {t("onboarding.page.unavailableTitle")}
              </p>
              <p className="text-sm leading-6 text-slate-600">
                {errorMessage ?? t("onboarding.page.unavailableDescription")}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" onClick={() => setReloadNonce((value) => value + 1)}>
                {t("common.actions.retry")}
              </Button>
              <Link
                href="/search"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                {t("common.actions.openJobSearch")}
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-16 shadow-panel">
          <p className="text-sm text-slate-600">{t("onboarding.page.loading")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              {t("common.brandName")}
            </Link>
            <p className="text-sm text-slate-600">
              {t("onboarding.page.tagline")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <LanguageSwitcher />
            {headerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-950">
                {item.label}
              </Link>
            ))}
            <span className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
              {user?.full_name ?? t("common.states.account")}
            </span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:pt-8">
            <OnboardingTimeline
              onboardingState={onboardingState}
              isBusy={isSaving}
              onSelectStage={handleSelectStage}
            />
          </aside>

          <section className="rounded-[2.25rem] border border-slate-200 bg-white px-6 py-8 shadow-panel sm:px-8 sm:py-10">
            <OnboardingStageContent
              stepIndex={currentStep}
              register={form.register}
              errors={form.formState.errors}
              values={currentValues}
              userName={user?.full_name}
              finalActionLabel={getNextButtonLabel(
                FINAL_ONBOARDING_STEP_INDEX,
                safeNextPath,
                t,
              )}
              completed={isCompleted}
            />

            {statusMessage ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {statusMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-8">
              <OnboardingNavigation
                canGoBack={currentStep > 0}
                isBusy={isSaving}
                nextLabel={nextButtonLabel}
                helperText={helperText}
                onBack={handleBack}
                onNext={handleNext}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function getNextButtonLabel(
  currentStep: number,
  nextPath: string | null,
  t: (path: string) => string,
) {
  if (currentStep < FINAL_ONBOARDING_STEP_INDEX - 1) {
    return t("common.actions.next");
  }

  if (currentStep === FINAL_ONBOARDING_STEP_INDEX - 1) {
    return t("common.actions.reviewSetup");
  }

  if (nextPath?.startsWith("/workspace")) {
    return t("common.actions.continueToWorkspace");
  }

  if (nextPath?.startsWith("/profile")) {
    return t("common.actions.openProfile");
  }

  return t("common.actions.openJobSearch");
}

function normalizeOnboardingState(state: OnboardingStateResponse) {
  return {
    ...state,
    current_step: Math.min(state.current_step, FINAL_ONBOARDING_STEP_INDEX),
    furthest_step: Math.min(state.furthest_step, FINAL_ONBOARDING_STEP_INDEX),
  };
}

async function validateStage(
  currentStep: number,
  form: UseFormReturn<CandidateProfileFormValues>,
  roleRequiredMessage: string,
) {
  const fields = stageFieldMap[currentStep];
  if (!fields?.length) {
    return true;
  }

  if (currentStep === 1 && !form.getValues("target_role").trim()) {
    form.setError("target_role", {
      type: "manual",
      message: roleRequiredMessage,
    });
    return false;
  }

  return form.trigger(fields);
}
