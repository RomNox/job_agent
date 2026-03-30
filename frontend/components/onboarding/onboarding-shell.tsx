"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type UseFieldArrayReturn,
  type UseFormReturn,
  Controller,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  type ChangeEvent,
  type HTMLInputTypeAttribute,
  type Ref,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import { OnboardingTimeline } from "@/components/onboarding/onboarding-timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
  ONBOARDING_STAGES,
  getPostOnboardingDestination,
} from "@/lib/onboarding";
import {
  candidateProfileToOnboardingValues,
  createEmptyEducationEntry,
  createEmptyExperienceEntry,
  createEmptyLanguageEntry,
  defaultOnboardingResumeValues,
  getVisibleEducationCount,
  getVisibleExperienceCount,
  getVisibleLanguageCount,
  onboardingValuesToProfilePayload,
} from "@/lib/resume";
import { onboardingResumeFormSchema } from "@/lib/schemas";
import type {
  OnboardingResumeFormValues,
  OnboardingStateResponse,
} from "@/types/api";

const stepFieldMap: Record<number, FieldPath<OnboardingResumeFormValues>[]> = {
  0: ["start_method"],
  1: [
    "user.first_name",
    "user.last_name",
    "user.birth_year",
    "user.email",
    "user.phone",
  ],
  2: [
    "user.address.street",
    "user.address.city",
    "user.address.postal_code",
    "user.address.country",
  ],
  3: ["resume.preferences.work_authorization_status"],
  4: ["resume.professional_title", "resume.preferences.years_of_experience"],
  5: ["resume.experience"],
  6: ["resume.education"],
  7: ["resume.skills"],
  8: ["resume.languages"],
  9: [
    "resume.preferences.preferred_locations",
    "resume.preferences.work_mode",
    "resume.preferences.salary_expectation",
    "resume.preferences.availability",
  ],
};

type SelectableOption = {
  value: string;
  label: string;
};

type StepView = {
  key: number;
  eyebrow: string;
  title: string;
  description: readonly string[];
  statusMessage: string | null;
  errorMessage: string | null;
  body: ReactNode;
};

type OnboardingShellProps = {
  nextPath?: string;
};

export function OnboardingShell({ nextPath }: OnboardingShellProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { messages, t } = useI18n();
  const flow = messages.onboarding.resumeFlow;
  const safeNextPath = getOptionalSafeNextPath(nextPath);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousStepRef = useRef(0);

  const [onboardingState, setOnboardingState] =
    useState<OnboardingStateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<OnboardingResumeFormValues>({
    resolver: zodResolver(onboardingResumeFormSchema),
    defaultValues: defaultOnboardingResumeValues,
  });

  const experienceFieldArray = useFieldArray({
    control: form.control,
    name: "resume.experience",
  });
  const educationFieldArray = useFieldArray({
    control: form.control,
    name: "resume.education",
  });
  const languageFieldArray = useFieldArray({
    control: form.control,
    name: "resume.languages",
  });

  const currentValues = form.watch();
  const currentStep = onboardingState?.current_step ?? 0;
  const stepContent = flow.steps;
  const stepMeta = stepContent[currentStep];
  const timelineSteps = stepContent.map((step, index) => ({
    id: ONBOARDING_STAGES[index]?.id ?? step.shortLabel.toLowerCase(),
    label: step.shortLabel,
  }));

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

        form.reset(candidateProfileToOnboardingValues(profile));
        const normalizedState = normalizeOnboardingState(state);
        previousStepRef.current = normalizedState.current_step;
        setOnboardingState(normalizedState);
        setStatusMessage(
          profile.updated_at
            ? flow.status.draftLoaded
            : flow.status.accountPrefilled,
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(error, {
            fallback: flow.status.loadError,
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
  }, [
    flow.status.accountPrefilled,
    flow.status.draftLoaded,
    flow.status.loadError,
    form,
    t,
    user?.id,
  ]);

  const stepTransitionDirection =
    currentStep >= previousStepRef.current ? "forward" : "backward";

  useEffect(() => {
    previousStepRef.current = currentStep;
  }, [currentStep]);

  const progressValue = ((currentStep + 1) / ONBOARDING_STAGES.length) * 100;
  const stepView: StepView = {
    key: currentStep,
    eyebrow: stepMeta.eyebrow,
    title: stepMeta.title,
    description: stepMeta.description,
    statusMessage,
    errorMessage,
    body: renderStep({
      currentStep,
      currentValues,
      form,
      experienceFieldArray,
      educationFieldArray,
      languageFieldArray,
      onChooseGuidedStart: handleChooseGuidedStart,
      onChooseUploadStart: handleChooseUploadStart,
      onTriggerFileInput: () => fileInputRef.current?.click(),
    }),
  };

  async function handleBack() {
    if (!onboardingState || currentStep === 0) {
      return;
    }

    await persistStep(Math.max(currentStep - 1, 0), false);
  }

  async function handleNext() {
    if (!onboardingState) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);

    const isValid = await validateCurrentStep(currentStep, form);
    if (!isValid) {
      return;
    }

    if (currentStep === FINAL_ONBOARDING_STEP_INDEX) {
      setIsSaving(true);
      try {
        const savedState = normalizeOnboardingState(
          await updateOnboardingState({
            current_step: FINAL_ONBOARDING_STEP_INDEX,
            completed: true,
          }),
        );
        setOnboardingState(savedState);
        router.replace(getPostOnboardingDestination(safeNextPath));
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error, {
            fallback: flow.status.completeError,
            network: t("auth.errors.backendUnavailable"),
          }),
        );
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setIsSaving(true);

    try {
      await saveResumeDraft();

      const nextStep = Math.min(currentStep + 1, FINAL_ONBOARDING_STEP_INDEX);
      const savedState = normalizeOnboardingState(
        await updateOnboardingState({
          current_step: nextStep,
          completed: onboardingState.completed,
        }),
      );
      setOnboardingState(savedState);
      setStatusMessage(
        nextStep === FINAL_ONBOARDING_STEP_INDEX
          ? flow.status.finalReviewReady
          : flow.status.progressSaved,
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: flow.status.saveError,
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSelectStep(stepIndex: number) {
    if (!onboardingState || stepIndex === currentStep || isSaving) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);

    if (stepIndex > currentStep) {
      const isValid = await validateCurrentStep(currentStep, form);
      if (!isValid) {
        return;
      }
    }

    setIsSaving(true);

    try {
      if (stepIndex > currentStep) {
        await saveResumeDraft();
      }

      const savedState = normalizeOnboardingState(
        await updateOnboardingState({
          current_step: stepIndex,
          completed: onboardingState.completed,
        }),
      );
      setOnboardingState(savedState);

      if (stepIndex > currentStep) {
        setStatusMessage(flow.status.progressSaved);
      }
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: flow.status.updateError,
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function persistStep(nextStep: number, completed: boolean) {
    if (!onboardingState) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setIsSaving(true);

    try {
      const savedState = normalizeOnboardingState(
        await updateOnboardingState({
          current_step: nextStep,
          completed,
        }),
      );
      setOnboardingState(savedState);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: flow.status.updateError,
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function saveResumeDraft() {
    const savedProfile = await upsertCandidateProfile(
      onboardingValuesToProfilePayload(form.getValues()),
    );
    form.reset(candidateProfileToOnboardingValues(savedProfile));
    return savedProfile;
  }

  async function handleResumeFileSelection(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage(flow.status.fileTooLarge);
      return;
    }

    try {
      const text = await readFileAsText(file);
      form.setValue("start_method", "upload", { shouldDirty: true });
      form.setValue("resume_reference_text", text, { shouldDirty: true });
      setStatusMessage(flow.status.fileLoaded);
      setErrorMessage(null);
    } catch {
      setErrorMessage(flow.status.fileReadError);
    }
  }

  function handleChooseGuidedStart() {
    form.setValue("start_method", "guided", { shouldDirty: true });
    form.setValue("resume_reference_text", "", { shouldDirty: true });
    setStatusMessage(flow.status.guidedSelected);
    setErrorMessage(null);
  }

  function handleChooseUploadStart() {
    form.setValue("start_method", "upload", { shouldDirty: true });
    setStatusMessage(flow.status.uploadSelected);
    setErrorMessage(null);
  }

  const nextLabel =
    currentStep === FINAL_ONBOARDING_STEP_INDEX
      ? t("common.actions.continueToWorkspace")
      : currentStep === 0
        ? flow.actions.continue
        : t("common.actions.next");

  if (isLoading || !onboardingState) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_26%),#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-8 shadow-panel backdrop-blur sm:px-8">
          <p className="text-sm font-medium text-slate-700">
            {isLoading ? flow.status.loading : flow.status.unavailable}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_26%),#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/85 px-6 py-5 shadow-panel backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="space-y-1">
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              {t("common.brandName")}
            </Link>
            <p className="text-sm text-slate-600">
              {flow.headerDescription}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">
              {user?.full_name ?? t("common.states.account")}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-panel backdrop-blur lg:block">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {flow.timelineTitle}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {flow.timelineDescription}
                </p>
              </div>

              <OnboardingTimeline
                steps={timelineSteps}
                currentStep={currentStep}
                isBusy={isSaving}
                onSelectStep={handleSelectStep}
              />

              <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-600">
                {flow.timelineHelper}
              </div>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-slate-200 bg-white/92 px-6 py-6 shadow-panel backdrop-blur sm:px-8 sm:py-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("onboarding.page.stepCounter", {
                    current: currentStep + 1,
                    total: ONBOARDING_STAGES.length,
                  })}
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>

              <StepContentTransition
                view={stepView}
                direction={stepTransitionDirection}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSaving}
                >
                  {t("common.actions.back")}
                </Button>
                <Button type="button" onClick={handleNext} disabled={isSaving}>
                  {isSaving ? t("common.states.saving") : nextLabel}
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.md,.rtf,.html,.htm,.json,.csv"
              onChange={handleResumeFileSelection}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function renderStep({
  currentStep,
  currentValues,
  form,
  experienceFieldArray,
  educationFieldArray,
  languageFieldArray,
  onChooseGuidedStart,
  onChooseUploadStart,
  onTriggerFileInput,
}: {
  currentStep: number;
  currentValues: OnboardingResumeFormValues;
  form: UseFormReturn<OnboardingResumeFormValues>;
  experienceFieldArray: UseFieldArrayReturn<
    OnboardingResumeFormValues,
    "resume.experience"
  >;
  educationFieldArray: UseFieldArrayReturn<
    OnboardingResumeFormValues,
    "resume.education"
  >;
  languageFieldArray: UseFieldArrayReturn<
    OnboardingResumeFormValues,
    "resume.languages"
  >;
  onChooseGuidedStart: () => void;
  onChooseUploadStart: () => void;
  onTriggerFileInput: () => void;
}) {
  switch (currentStep) {
    case 0:
      return (
        <WelcomeStep
          form={form}
          onChooseGuidedStart={onChooseGuidedStart}
          onChooseUploadStart={onChooseUploadStart}
          onTriggerFileInput={onTriggerFileInput}
        />
      );
    case 1:
      return <PersonalDetailsStep form={form} />;
    case 2:
      return <AddressStep form={form} />;
    case 3:
      return <WorkAuthorizationStep form={form} />;
    case 4:
      return <TargetRoleStep form={form} />;
    case 5:
      return (
        <ExperienceStep
          form={form}
          fieldArray={experienceFieldArray}
          values={currentValues}
        />
      );
    case 6:
      return (
        <EducationStep
          form={form}
          fieldArray={educationFieldArray}
          values={currentValues}
        />
      );
    case 7:
      return <SkillsStep form={form} />;
    case 8:
      return (
        <LanguagesStep
          form={form}
          fieldArray={languageFieldArray}
          values={currentValues}
        />
      );
    case 9:
      return <PreferencesStep form={form} />;
    case 10:
      return <ReadyStep values={currentValues} />;
    default:
      return null;
  }
}

function WelcomeStep({
  form,
  onChooseGuidedStart,
  onChooseUploadStart,
  onTriggerFileInput,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
  onChooseGuidedStart: () => void;
  onChooseUploadStart: () => void;
  onTriggerFileInput: () => void;
}) {
  const flow = useResumeFlowCopy();
  const startMethod = form.watch("start_method");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <button
          type="button"
          onClick={onChooseGuidedStart}
          className={cn(
            "rounded-[1.8rem] border px-5 py-5 text-left transition-colors",
            startMethod === "guided"
              ? "border-slate-900 bg-slate-950 text-white"
              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300",
          )}
        >
          <p className="text-sm font-semibold">{flow.actions.createResume}</p>
          <p className="mt-2 text-sm leading-6 opacity-80">
            {flow.start.guidedDescription}
          </p>
        </button>

        <button
          type="button"
          onClick={onChooseUploadStart}
          className={cn(
            "rounded-[1.8rem] border px-5 py-5 text-left transition-colors",
            startMethod === "upload"
              ? "border-slate-900 bg-slate-950 text-white"
              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300",
          )}
        >
          <p className="text-sm font-semibold">
            {flow.actions.uploadExistingResume}
          </p>
          <p className="mt-2 text-sm leading-6 opacity-80">
            {flow.start.uploadDescription}
          </p>
        </button>
      </div>

      {startMethod === "upload" ? (
        <div className="space-y-4 rounded-[1.8rem] border border-slate-200 bg-slate-50 px-5 py-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">
              {flow.start.referenceTitle}
            </p>
            <p className="text-sm leading-6 text-slate-600">
              {flow.start.referenceDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={onTriggerFileInput}>
              {flow.actions.uploadFile}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                form.setValue("resume_reference_text", "", { shouldDirty: true })
              }
            >
              {flow.actions.clearReference}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume_reference_text">{flow.start.referenceLabel}</Label>
            <Textarea
              id="resume_reference_text"
              className="min-h-[220px] bg-white"
              placeholder={flow.start.referencePlaceholder}
              {...form.register("resume_reference_text")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PersonalDetailsStep({
  form,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
}) {
  const flow = useResumeFlowCopy();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        form={form}
        name="user.first_name"
        label={flow.fields.firstName}
        placeholder={flow.placeholders.firstName}
      />
      <Field
        form={form}
        name="user.last_name"
        label={flow.fields.lastName}
        placeholder={flow.placeholders.lastName}
      />
      <Field
        form={form}
        name="user.birth_year"
        label={flow.fields.birthYear}
        placeholder={flow.placeholders.birthYear}
      />
      <Field
        form={form}
        name="user.email"
        label={flow.fields.email}
        placeholder={flow.placeholders.email}
        type="email"
      />
      <div className="sm:col-span-2">
        <Field
          form={form}
          name="user.phone"
          label={flow.fields.phone}
          placeholder={flow.placeholders.phone}
        />
      </div>
    </div>
  );
}

function AddressStep({
  form,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
}) {
  const flow = useResumeFlowCopy();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field
          form={form}
          name="user.address.street"
          label={flow.fields.street}
          placeholder={flow.placeholders.street}
        />
      </div>
      <Field
        form={form}
        name="user.address.city"
        label={flow.fields.city}
        placeholder={flow.placeholders.city}
      />
      <Field
        form={form}
        name="user.address.postal_code"
        label={flow.fields.postalCode}
        placeholder={flow.placeholders.postalCode}
      />
      <div className="sm:col-span-2">
        <Field
          form={form}
          name="user.address.country"
          label={flow.fields.country}
          placeholder={flow.placeholders.country}
        />
      </div>
    </div>
  );
}

function WorkAuthorizationStep({
  form,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
}) {
  const flow = useResumeFlowCopy();

  return (
    <div className="space-y-4">
      <Label>{flow.fields.workAuthorizationStatus}</Label>
      <Controller
        control={form.control}
        name="resume.preferences.work_authorization_status"
        render={({ field }) => (
          <OptionGroup
            options={flow.options.workAuthorization}
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />
      <FieldError message={getFieldError(form.formState.errors, "resume.preferences.work_authorization_status")} />
    </div>
  );
}

function TargetRoleStep({
  form,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
}) {
  const flow = useResumeFlowCopy();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        form={form}
        name="resume.professional_title"
        label={flow.fields.desiredRole}
        placeholder={flow.placeholders.desiredRole}
      />
      <Field
        form={form}
        name="resume.preferences.years_of_experience"
        label={flow.fields.yearsOfExperience}
        placeholder={flow.placeholders.yearsOfExperience}
      />
    </div>
  );
}

function ExperienceStep({
  form,
  fieldArray,
  values,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
  fieldArray: UseFieldArrayReturn<OnboardingResumeFormValues, "resume.experience">;
  values: OnboardingResumeFormValues;
}) {
  const flow = useResumeFlowCopy();
  const visibleCount = getVisibleExperienceCount(values);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
        {flow.experience.intro}
      </div>

      {fieldArray.fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-5 rounded-[1.8rem] border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950">
              {tString(flow.experience.itemLabel, { number: index + 1 })}
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => fieldArray.remove(index)}
            >
              {flow.actions.remove}
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              form={form}
              name={`resume.experience.${index}.job_title`}
              label={flow.fields.jobTitle}
              placeholder={flow.placeholders.jobTitle}
            />
            <Field
              form={form}
              name={`resume.experience.${index}.company`}
              label={flow.fields.company}
              placeholder={flow.placeholders.company}
            />
            <Field
              form={form}
              name={`resume.experience.${index}.location`}
              label={flow.fields.location}
              placeholder={flow.placeholders.location}
            />
            <Field
              form={form}
              name={`resume.experience.${index}.start_date`}
              label={flow.fields.startDate}
              placeholder={flow.placeholders.startDate}
              type="date"
            />
            <Field
              form={form}
              name={`resume.experience.${index}.end_date`}
              label={flow.fields.endDate}
              placeholder={flow.placeholders.endDate}
              type="date"
            />
          </div>

          <TextAreaField
            form={form}
            name={`resume.experience.${index}.responsibilities`}
            label={flow.fields.responsibilities}
            placeholder={flow.placeholders.responsibilities}
          />

          <Controller
            control={form.control}
            name={`resume.experience.${index}.technologies_used`}
            render={({ field }) => (
              <TagInputField
                label={flow.fields.technologiesUsed}
                placeholder={flow.placeholders.technologiesUsed}
                value={field.value ?? []}
                onChange={field.onChange}
                error={getFieldError(
                  form.formState.errors,
                  `resume.experience.${index}.technologies_used`,
                )}
              />
            )}
          />
        </div>
      ))}

      <div className="flex items-center justify-between gap-3 rounded-[1.6rem] border border-dashed border-slate-200 px-4 py-4">
        <p className="text-sm text-slate-600">
          {formatCountMessage(
            visibleCount,
            flow.experience.countOne,
            flow.experience.countOther,
          )}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => fieldArray.append(createEmptyExperienceEntry())}
        >
          {flow.actions.addAnotherPosition}
        </Button>
      </div>
    </div>
  );
}

function EducationStep({
  form,
  fieldArray,
  values,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
  fieldArray: UseFieldArrayReturn<OnboardingResumeFormValues, "resume.education">;
  values: OnboardingResumeFormValues;
}) {
  const flow = useResumeFlowCopy();
  const visibleCount = getVisibleEducationCount(values);

  return (
    <div className="space-y-5">
      {fieldArray.fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-5 rounded-[1.8rem] border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950">
              {tString(flow.education.itemLabel, { number: index + 1 })}
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => fieldArray.remove(index)}
            >
              {flow.actions.remove}
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              form={form}
              name={`resume.education.${index}.institution`}
              label={flow.fields.institution}
              placeholder={flow.placeholders.institution}
            />
            <Field
              form={form}
              name={`resume.education.${index}.degree`}
              label={flow.fields.degree}
              placeholder={flow.placeholders.degree}
            />
            <div className="sm:col-span-2">
              <Field
                form={form}
                name={`resume.education.${index}.field_of_study`}
                label={flow.fields.fieldOfStudy}
                placeholder={flow.placeholders.fieldOfStudy}
              />
            </div>
            <Field
              form={form}
              name={`resume.education.${index}.start_year`}
              label={flow.fields.startYear}
              placeholder={flow.placeholders.startYear}
            />
            <Field
              form={form}
              name={`resume.education.${index}.end_year`}
              label={flow.fields.endYear}
              placeholder={flow.placeholders.endYear}
            />
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between gap-3 rounded-[1.6rem] border border-dashed border-slate-200 px-4 py-4">
        <p className="text-sm text-slate-600">
          {formatCountMessage(
            visibleCount,
            flow.education.countOne,
            flow.education.countOther,
          )}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => fieldArray.append(createEmptyEducationEntry())}
        >
          {flow.actions.addAnotherEducation}
        </Button>
      </div>
    </div>
  );
}

function SkillsStep({
  form,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
}) {
  const flow = useResumeFlowCopy();

  return (
    <Controller
      control={form.control}
      name="resume.skills"
      render={({ field }) => (
        <TagInputField
          label={flow.fields.skills}
          placeholder={flow.skills.inputPlaceholder}
          value={field.value ?? []}
          onChange={field.onChange}
          error={getFieldError(form.formState.errors, "resume.skills")}
          example={flow.skills.example}
        />
      )}
    />
  );
}

function LanguagesStep({
  form,
  fieldArray,
  values,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
  fieldArray: UseFieldArrayReturn<OnboardingResumeFormValues, "resume.languages">;
  values: OnboardingResumeFormValues;
}) {
  const flow = useResumeFlowCopy();
  const visibleCount = getVisibleLanguageCount(values);

  return (
    <div className="space-y-5">
      {fieldArray.fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-5 rounded-[1.8rem] border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950">
              {tString(flow.languages.itemLabel, { number: index + 1 })}
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => fieldArray.remove(index)}
            >
              {flow.actions.remove}
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              form={form}
              name={`resume.languages.${index}.language`}
              label={flow.fields.language}
              placeholder={flow.placeholders.language}
            />
            <Field
              form={form}
              name={`resume.languages.${index}.level`}
              label={flow.fields.level}
              placeholder={flow.placeholders.level}
            />
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between gap-3 rounded-[1.6rem] border border-dashed border-slate-200 px-4 py-4">
        <p className="text-sm text-slate-600">
          {formatCountMessage(
            visibleCount,
            flow.languages.countOne,
            flow.languages.countOther,
          )}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => fieldArray.append(createEmptyLanguageEntry())}
        >
          {flow.actions.addAnotherLanguage}
        </Button>
      </div>
    </div>
  );
}

function PreferencesStep({
  form,
}: {
  form: UseFormReturn<OnboardingResumeFormValues>;
}) {
  const flow = useResumeFlowCopy();

  return (
    <div className="space-y-5">
      <Controller
        control={form.control}
        name="resume.preferences.preferred_locations"
        render={({ field }) => (
          <TagInputField
            label={flow.fields.preferredLocations}
            placeholder={flow.placeholders.preferredLocations}
            value={field.value ?? []}
            onChange={field.onChange}
            error={getFieldError(
              form.formState.errors,
              "resume.preferences.preferred_locations",
            )}
          />
        )}
      />

      <div className="space-y-3">
        <Label>{flow.fields.workMode}</Label>
        <Controller
          control={form.control}
          name="resume.preferences.work_mode"
          render={({ field }) => (
            <OptionGroup
              options={flow.options.workMode}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        <FieldError message={getFieldError(form.formState.errors, "resume.preferences.work_mode")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          form={form}
          name="resume.preferences.salary_expectation"
          label={flow.fields.salaryExpectation}
          placeholder={flow.placeholders.salaryExpectation}
        />
        <Field
          form={form}
          name="resume.preferences.availability"
          label={flow.fields.availability}
          placeholder={flow.placeholders.availability}
        />
      </div>
    </div>
  );
}

function ReadyStep({ values }: { values: OnboardingResumeFormValues }) {
  const flow = useResumeFlowCopy();
  const { t } = useI18n();
  const notProvided = t("common.states.notProvided");
  const summaryCards = [
    {
      title: flow.ready.cards.profile,
      rows: [
        [
          flow.ready.labels.name,
          `${values.user.first_name} ${values.user.last_name}`.trim(),
        ],
        [flow.ready.labels.email, values.user.email],
        [flow.ready.labels.phone, values.user.phone],
        [
          flow.ready.labels.location,
          [
            values.user.address.city,
            values.user.address.country,
          ]
            .filter(Boolean)
            .join(", "),
        ],
        [
          flow.ready.labels.workAuthorization,
          getOptionLabel(
            flow.options.workAuthorization,
            values.resume.preferences.work_authorization_status,
          ),
        ],
      ],
    },
    {
      title: flow.ready.cards.resume,
      rows: [
        [flow.ready.labels.targetRole, values.resume.professional_title],
        [
          flow.ready.labels.yearsOfExperience,
          values.resume.preferences.years_of_experience,
        ],
        [flow.ready.labels.skills, values.resume.skills.join(", ")],
        [
          flow.ready.labels.languages,
          values.resume.languages
            .filter((entry) => entry.language || entry.level)
            .map((entry) => [entry.language, entry.level].filter(Boolean).join(" "))
            .join(", "),
        ],
      ],
    },
    {
      title: flow.ready.cards.preferences,
      rows: [
        [
          flow.ready.labels.preferredLocations,
          values.resume.preferences.preferred_locations.join(", "),
        ],
        [
          flow.ready.labels.workMode,
          getOptionLabel(flow.options.workMode, values.resume.preferences.work_mode),
        ],
        [flow.ready.labels.salary, values.resume.preferences.salary_expectation],
        [flow.ready.labels.availability, values.resume.preferences.availability],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50 px-5 py-5 text-sm leading-6 text-emerald-950">
        {flow.ready.notice}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-[1.8rem] border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-semibold text-slate-950">{card.title}</p>
            <div className="mt-4 space-y-3">
              {card.rows.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {value?.trim() || notProvided}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
}: {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={String(name)}>{label}</Label>
      <Input
        id={String(name)}
        type={type}
        placeholder={placeholder}
        {...form.register(name)}
      />
      <FieldError message={getFieldError(form.formState.errors, name)} />
    </div>
  );
}

function TextAreaField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={String(name)}>{label}</Label>
      <Textarea
        id={String(name)}
        className="min-h-[150px]"
        placeholder={placeholder}
        {...form.register(name)}
      />
      <FieldError message={getFieldError(form.formState.errors, name)} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-700">{message}</p>;
}

function OptionGroup({
  options,
  value,
  onChange,
}: {
  options: readonly SelectableOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            value === option.value
              ? "border-slate-900 bg-slate-950 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function StepContentTransition({
  view,
  direction,
}: {
  view: StepView;
  direction: "forward" | "backward";
}) {
  const [displayedView, setDisplayedView] = useState(view);
  const [queuedView, setQueuedView] = useState<StepView | null>(null);
  const [phase, setPhase] = useState<"idle" | "exiting" | "entering">("idle");
  const [activeDirection, setActiveDirection] = useState(direction);
  const [minHeight, setMinHeight] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const isTransitioning = phase !== "idle";

  useEffect(() => {
    if (view.key === displayedView.key) {
      if (phase !== "exiting") {
        setDisplayedView(view);
      }
      return;
    }

    if (queuedView && view.key === queuedView.key) {
      setQueuedView(view);
      return;
    }

    setQueuedView(view);
    setActiveDirection(direction);

    if (phase === "idle") {
      setMinHeight(panelRef.current?.offsetHeight ?? null);
      setPhase("exiting");
    }
  }, [direction, displayedView, phase, queuedView, view]);

  function handleAnimationEnd() {
    if (phase === "exiting") {
      if (!queuedView) {
        setPhase("idle");
        setMinHeight(null);
        return;
      }

      setDisplayedView(queuedView);
      setQueuedView(null);
      setPhase("entering");
      return;
    }

    if (phase === "entering") {
      if (queuedView && queuedView.key !== displayedView.key) {
        setMinHeight(panelRef.current?.offsetHeight ?? minHeight);
        setPhase("exiting");
        return;
      }

      setPhase("idle");
      setMinHeight(null);
    }
  }

  return (
    <div
      className="overflow-hidden"
      style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
    >
      <StepContentPanel
        panelRef={panelRef}
        key={`${displayedView.key}-${phase}`}
        view={displayedView}
        className={cn(
          isTransitioning && "pointer-events-none will-change-transform",
          phase === "exiting" &&
            (activeDirection === "forward"
              ? "animate-onboarding-step-exit-forward"
              : "animate-onboarding-step-exit-backward"),
          phase === "entering" &&
            (activeDirection === "forward"
              ? "animate-onboarding-step-enter-forward"
              : "animate-onboarding-step-enter-backward"),
        )}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
}

function StepContentPanel({
  view,
  className,
  panelRef,
  onAnimationEnd,
}: {
  view: StepView;
  className?: string;
  panelRef?: Ref<HTMLDivElement>;
  onAnimationEnd?: () => void;
}) {
  return (
    <div
      ref={panelRef}
      className={cn("space-y-6", className)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {view.eyebrow}
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {view.title}
          </h1>
          <div className="max-w-3xl space-y-3 text-base leading-8 text-slate-600">
            {view.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {view.statusMessage ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {view.statusMessage}
        </div>
      ) : null}

      {view.errorMessage ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {view.errorMessage}
        </div>
      ) : null}

      {view.body}
    </div>
  );
}

function TagInputField({
  label,
  placeholder,
  value,
  onChange,
  error,
  example,
}: {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  example?: string;
}) {
  const [draft, setDraft] = useState("");

  function commitValue(rawValue: string) {
    const normalized = rawValue.trim();
    if (!normalized) {
      return;
    }

    const nextValues = Array.from(new Set([...value, normalized]));
    onChange(nextValues);
    setDraft("");
  }

  function removeValue(target: string) {
    onChange(value.filter((item) => item !== target));
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => removeValue(item)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-200"
              >
                {item} ×
              </button>
            ))}
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  commitValue(draft.replace(/,$/, ""));
                }
                if (event.key === "Backspace" && !draft && value.length) {
                  removeValue(value[value.length - 1] ?? "");
                }
              }}
              onBlur={() => commitValue(draft)}
              placeholder={placeholder}
              className="min-w-[180px] flex-1 border-none bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
      {example ? <p className="text-sm text-slate-500">{example}</p> : null}
      <FieldError message={error} />
    </div>
  );
}

async function validateCurrentStep(
  currentStep: number,
  form: UseFormReturn<OnboardingResumeFormValues>,
) {
  const fields = stepFieldMap[currentStep];
  if (!fields?.length) {
    return true;
  }

  return form.trigger(fields);
}

function normalizeOnboardingState(
  state: OnboardingStateResponse,
): OnboardingStateResponse {
  const currentStep = state.completed
    ? FINAL_ONBOARDING_STEP_INDEX
    : Math.min(state.current_step, FINAL_ONBOARDING_STEP_INDEX);
  const furthestStep = state.completed
    ? FINAL_ONBOARDING_STEP_INDEX
    : Math.min(state.furthest_step, FINAL_ONBOARDING_STEP_INDEX);

  return {
    ...state,
    current_step: currentStep,
    furthest_step: furthestStep,
  };
}

function getFieldError(
  errors: FieldErrors,
  path: string,
): string | undefined {
  const segments = path.split(".");
  let current: unknown = errors;

  for (const segment of segments) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  if (
    current &&
    typeof current === "object" &&
    "message" in current &&
    typeof current.message === "string"
  ) {
    return current.message;
  }

  return undefined;
}

function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function useResumeFlowCopy() {
  const { messages } = useI18n();
  return messages.onboarding.resumeFlow;
}

function tString(
  template: string,
  values?: Record<string, string | number>,
) {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}

function formatCountMessage(
  count: number,
  singular: string,
  plural: string,
) {
  return tString(count === 1 ? singular : plural, { count });
}

function getOptionLabel(
  options: readonly SelectableOption[],
  value: string,
) {
  if (!value) {
    return "";
  }

  return options.find((option) => option.value === value)?.label ?? value;
}
