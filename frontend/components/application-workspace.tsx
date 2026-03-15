"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/components/auth/auth-provider";
import { CandidateProfileForm } from "@/components/candidate-profile-form";
import { ChecklistCard } from "@/components/checklist-card";
import { CoverLetterCard } from "@/components/cover-letter-card";
import { CVTailoringCard } from "@/components/cv-tailoring-card";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import { JobInputForm } from "@/components/job-input-form";
import { MatchResultCard } from "@/components/match-result-card";
import { ProgressIndicator } from "@/components/progress-indicator";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import {
  getApiErrorMessage,
  getApiBaseUrl,
  getCandidateProfile,
  parseJob,
  prepareApplication,
  upsertCandidateProfile,
} from "@/lib/api";
import {
  candidateProfileToWorkspaceValues,
  formatProfileTimestamp,
  PROFILE_FIELD_NAMES,
  workspaceValuesToCandidateProfilePayload,
  workspaceValuesToProfilePayload,
} from "@/lib/profile";
import { consumeResolvedJobContent } from "@/lib/resolved-job-handoff";
import { createWorkspaceFormSchema } from "@/lib/schemas";
import type {
  ApplicationPackageResponse,
  ParsedJobResponse,
  PrepareApplicationBasePayload,
  ResolvedJobContent,
  WorkspaceFormValues,
} from "@/types/api";

type WorkflowStep = "idle" | "parsing" | "preparing" | "done";

const defaultValues: WorkspaceFormValues = {
  job_url: "",
  raw_job_text: "",
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

type ApplicationWorkspaceProps = {
  initialJobUrl?: string;
  initialRawJobText?: string;
  initialResolvedJobKey?: string;
};

type RunWorkspaceFlowOptions = {
  allowJobContentOnly?: boolean;
};

export function ApplicationWorkspace({
  initialJobUrl = "",
  initialRawJobText = "",
  initialResolvedJobKey = "",
}: ApplicationWorkspaceProps) {
  const { user } = useAuth();
  const { locale, t } = useI18n();
  const initialPrefill = buildWorkspacePrefill({
    jobUrl: initialJobUrl,
    rawJobText: initialRawJobText,
  });
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(
      createWorkspaceFormSchema((key) => t(`validation.${key}`)),
    ),
    defaultValues: {
      ...defaultValues,
      job_url: initialPrefill.jobUrl,
      raw_job_text: initialPrefill.rawJobText,
    },
  });

  const [parsedJob, setParsedJob] = useState<ParsedJobResponse | null>(null);
  const [applicationPackage, setApplicationPackage] =
    useState<ApplicationPackageResponse | null>(null);
  const [prefill, setPrefill] = useState<WorkspacePrefill>(initialPrefill);
  const [resolvedJobContent, setResolvedJobContent] =
    useState<ResolvedJobContent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("idle");
  const [hasHydratedProfile, setHasHydratedProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatusMessage, setProfileStatusMessage] = useState<string | null>(
    null,
  );
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(
    null,
  );
  const lastAutoSubmittedInputKeyRef = useRef<string | null>(null);

  const watchedUrl = form.watch("job_url");
  const watchedRawText = form.watch("raw_job_text");
  const prefersRawText = Boolean(watchedUrl.trim() && watchedRawText.trim());

  useEffect(() => {
    setResolvedJobContent(null);
    setPrefill(
      buildWorkspacePrefill({
        jobUrl: initialJobUrl,
        rawJobText: initialRawJobText,
      }),
    );
  }, [initialJobUrl, initialRawJobText]);

  useEffect(() => {
    if (!initialResolvedJobKey) {
      return;
    }

    const restoredResolvedJobContent = consumeResolvedJobContent(
      initialResolvedJobKey,
    );
    if (!restoredResolvedJobContent) {
      setErrorMessage(t("workspace.notices.resolvedRestoreFailed"));
      return;
    }

    setResolvedJobContent(restoredResolvedJobContent);
    setPrefill({
      jobUrl: restoredResolvedJobContent.source_url,
      rawJobText: restoredResolvedJobContent.raw_text,
      autoRunKey: `resolved:${initialResolvedJobKey}`,
    });
  }, [initialResolvedJobKey, t]);

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      job_url: prefill.jobUrl,
      raw_job_text: prefill.rawJobText,
    });
    setParsedJob(null);
    setApplicationPackage(null);
    setErrorMessage(null);
    setCurrentStep("idle");
  }, [form, prefill.autoRunKey, prefill.jobUrl, prefill.rawJobText]);

  useEffect(() => {
    if (!user?.id) {
      setHasHydratedProfile(true);
      setIsProfileLoading(false);
      return;
    }

    let isActive = true;
    setHasHydratedProfile(false);
    setIsProfileLoading(true);
    setProfileErrorMessage(null);
    setProfileStatusMessage(null);

    void (async () => {
      try {
        const profile = await getCandidateProfile();
        if (!isActive) {
          return;
        }

        form.reset(
          {
            ...form.getValues(),
            ...candidateProfileToWorkspaceValues(profile),
          },
          { keepDirtyValues: true },
        );
        if (!profile.updated_at) {
          setProfileStatusMessage(t("workspace.profile.noSavedProfile"));
        } else {
          setProfileStatusMessage(
            t("workspace.profile.loadedProfile", {
              timestamp:
                formatProfileTimestamp(profile.updated_at, locale) ??
                t("common.states.recently"),
            }),
          );
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        setProfileErrorMessage(
          getApiErrorMessage(error, {
            fallback: t("workspace.notices.loadProfileFailed"),
            network: t("auth.errors.backendUnavailable"),
          }),
        );
      } finally {
        if (!isActive) {
          return;
        }

        setIsProfileLoading(false);
        setHasHydratedProfile(true);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [form, locale, t, user?.id]);

  useEffect(() => {
    if (!hasHydratedProfile) {
      return;
    }

    const autoRunKey = prefill.autoRunKey;
    const normalizedJobUrl = prefill.jobUrl.trim();
    const normalizedRawJobText = prefill.rawJobText.trim();

    if (!autoRunKey || (!normalizedJobUrl && !normalizedRawJobText)) {
      lastAutoSubmittedInputKeyRef.current = null;
      return;
    }

    if (lastAutoSubmittedInputKeyRef.current === autoRunKey) {
      return;
    }

    lastAutoSubmittedInputKeyRef.current = autoRunKey;

    void runWorkspaceFlow({
      values: {
        ...form.getValues(),
        job_url: normalizedJobUrl,
        raw_job_text: normalizedRawJobText,
      },
      setParsedJob,
      setApplicationPackage,
      setErrorMessage,
      setCurrentStep,
      fallbackErrorMessage: t("workspace.notices.applicationFailed"),
      options: { allowJobContentOnly: true },
    });
  }, [
    form,
    hasHydratedProfile,
    t,
    prefill.autoRunKey,
    prefill.jobUrl,
    prefill.rawJobText,
  ]);

  const onSubmit = form.handleSubmit((values) =>
    runWorkspaceFlow({
      values,
      setParsedJob,
      setApplicationPackage,
      setErrorMessage,
      setCurrentStep,
      fallbackErrorMessage: t("workspace.notices.applicationFailed"),
    }),
  );
  const handleSaveProfile = async () => {
    setProfileErrorMessage(null);
    setProfileStatusMessage(null);

    const isValid = await form.trigger(PROFILE_FIELD_NAMES);
    if (!isValid) {
      return;
    }

    setIsSavingProfile(true);

    try {
      const savedProfile = await upsertCandidateProfile(
        workspaceValuesToProfilePayload(form.getValues()),
      );
      form.reset({
        ...form.getValues(),
        ...candidateProfileToWorkspaceValues(savedProfile),
      });
      setProfileStatusMessage(
        savedProfile.updated_at
          ? t("workspace.profile.savedProfileAt", {
              timestamp:
                formatProfileTimestamp(savedProfile.updated_at, locale) ??
                t("common.states.recently"),
            })
          : t("workspace.profile.savedProfile"),
      );
    } catch (error) {
      setProfileErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("workspace.notices.saveProfileFailed"),
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const hasResults = Boolean(parsedJob || applicationPackage);
  const previewFallbackNotice =
    resolvedJobContent?.fetch_method === "search_preview"
      ? resolvedJobContent.resolution_notes ??
        t("workspace.notices.previewFallback")
      : null;
  const resultsTitle = applicationPackage
    ? applicationPackage.job_posting.title
    : parsedJob?.page_title ||
      resolvedJobContent?.title ||
      t("workspace.results.defaultTitle");

  return (
    <main className="surface-grid min-h-screen bg-slate-50/60">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 shadow-panel backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("workspace.header.eyebrow")}
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {t("workspace.header.title")}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                  {t("workspace.header.description")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LanguageSwitcher />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {t("workspace.header.backendAt")}{" "}
                  <span className="font-mono text-xs text-slate-900">
                    {getApiBaseUrl()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(360px,460px)_minmax(0,1fr)] lg:p-8">
            <section className="space-y-6">
              <ProgressIndicator
                currentStep={currentStep}
                skipParsing={Boolean(watchedRawText.trim())}
              />

              <form className="space-y-6" onSubmit={onSubmit}>
                <JobInputForm
                  register={form.register}
                  errors={form.formState.errors}
                  prefersRawText={prefersRawText}
                />
                <CandidateProfileForm
                  register={form.register}
                  errors={form.formState.errors}
                  isProfileLoading={isProfileLoading}
                  isSavingProfile={isSavingProfile}
                  profileStatusMessage={profileStatusMessage}
                  profileErrorMessage={profileErrorMessage}
                  onSaveProfile={handleSaveProfile}
                />

                {previewFallbackNotice ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {previewFallbackNotice}
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  {form.formState.isSubmitting
                    ? currentStep === "parsing"
                      ? t("workspace.actions.parsing")
                      : t("workspace.actions.preparing")
                    : t("workspace.actions.prepare")}
                </Button>
              </form>
            </section>

            <section className="space-y-6">
              <SectionCard
                title={resultsTitle}
                description={
                  hasResults
                    ? t("workspace.notices.structuredOutput")
                    : resolvedJobContent
                      ? t("workspace.notices.resolvedLoaded")
                      : t("workspace.notices.submitToRender")
                }
              >
                {!hasResults ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm leading-7 text-slate-500">
                    {resolvedJobContent
                      ? t("workspace.notices.resolvedResults")
                      : t("workspace.notices.emptyResults")}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {parsedJob ? (
                      <SectionCard
                        title={t("workspace.results.parsedJobTitle")}
                        description={t("workspace.results.parsedJobDescription")}
                        className="border-dashed shadow-none"
                      >
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <InfoBlock
                              label={t("workspace.results.sourceUrl")}
                              value={parsedJob.source_url}
                              mono
                            />
                            <InfoBlock
                              label={t("workspace.results.detectedSource")}
                              value={
                                parsedJob.detected_source ??
                                t("common.states.unknown")
                              }
                            />
                          </div>
                          <InfoBlock
                            label={t("workspace.results.pageTitle")}
                            value={
                              parsedJob.page_title ?? t("common.states.unavailable")
                            }
                          />
                          <TextBlock
                            label={t("workspace.results.rawText")}
                            value={parsedJob.raw_text}
                          />
                          {parsedJob.extraction_warnings.length ? (
                            <BulletSection
                              title={t("workspace.results.extractionWarnings")}
                              items={parsedJob.extraction_warnings}
                            />
                          ) : null}
                        </div>
                      </SectionCard>
                    ) : null}

                    {applicationPackage ? (
                      <>
                        <SectionCard
                          title={t("workspace.results.jobPostingTitle")}
                          description={t("workspace.results.jobPostingDescription")}
                          className="border-dashed shadow-none"
                        >
                          <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              <InfoBlock
                                label={t("workspace.results.employer")}
                                value={
                                  applicationPackage.job_posting.employer ||
                                  t("common.states.notProvided")
                                }
                              />
                              <InfoBlock
                                label={t("workspace.results.location")}
                                value={
                                  applicationPackage.job_posting.location ||
                                  t("common.states.notProvided")
                                }
                              />
                              <InfoBlock
                                label={t("workspace.results.employmentType")}
                                value={
                                  applicationPackage.job_posting.employment_type ||
                                  t("common.states.notProvided")
                                }
                              />
                              <InfoBlock
                                label={t("workspace.results.language")}
                                value={
                                  applicationPackage.job_posting.language ||
                                  t("common.states.notProvided")
                                }
                              />
                            </div>
                            <TextBlock
                              label={t("workspace.results.summary")}
                              value={applicationPackage.job_posting.summary}
                            />
                            <div className="grid gap-5 md:grid-cols-2">
                              <BulletSection
                                title={t("workspace.results.requirements")}
                                items={applicationPackage.job_posting.requirements}
                              />
                              <BulletSection
                                title={t("workspace.results.missingInformation")}
                                items={applicationPackage.job_posting.missing_information}
                              />
                            </div>
                          </div>
                        </SectionCard>
                        <MatchResultCard matchResult={applicationPackage.match_result} />
                        <CoverLetterCard coverLetter={applicationPackage.cover_letter} />
                        <CVTailoringCard cvTailoring={applicationPackage.cv_tailoring} />
                        <ChecklistCard
                          checklist={applicationPackage.checklist}
                          warnings={applicationPackage.warnings}
                        />
                      </>
                    ) : null}
                  </div>
                )}
              </SectionCard>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

async function runWorkspaceFlow({
  values,
  setParsedJob,
  setApplicationPackage,
  setErrorMessage,
  setCurrentStep,
  fallbackErrorMessage,
  options,
}: {
  values: WorkspaceFormValues;
  setParsedJob: (value: ParsedJobResponse | null) => void;
  setApplicationPackage: (value: ApplicationPackageResponse | null) => void;
  setErrorMessage: (value: string | null) => void;
  setCurrentStep: (value: WorkflowStep) => void;
  fallbackErrorMessage: string;
  options?: RunWorkspaceFlowOptions;
}) {
  setErrorMessage(null);
  setParsedJob(null);
  setApplicationPackage(null);

  try {
    const payloadBase = buildPayload(values);
    const rawJobText = values.raw_job_text.trim();
    const jobUrl = values.job_url.trim();

    if (rawJobText) {
      if (options?.allowJobContentOnly && !hasCandidateProfile(values)) {
        setCurrentStep("idle");
        return;
      }

      setCurrentStep("preparing");
      const prepared = await prepareApplication({
        ...payloadBase,
        raw_text: rawJobText,
        source_url: jobUrl || undefined,
      });
      setApplicationPackage(prepared);
      setCurrentStep("done");
      return;
    }

    setCurrentStep("parsing");
    const parsed = await parseJob(jobUrl);
    setParsedJob(parsed);

    if (options?.allowJobContentOnly && !hasCandidateProfile(values)) {
      setCurrentStep("idle");
      return;
    }

    setCurrentStep("preparing");
    const prepared = await prepareApplication({
      ...payloadBase,
      raw_text: parsed.raw_text,
      source_url: parsed.source_url,
    });
    setApplicationPackage(prepared);
    setCurrentStep("done");
  } catch (error) {
    setCurrentStep("idle");
    setErrorMessage(
      error instanceof Error ? error.message : fallbackErrorMessage,
    );
  }
}

function hasCandidateProfile(values: WorkspaceFormValues) {
  return Boolean(values.full_name.trim());
}

type WorkspacePrefill = {
  jobUrl: string;
  rawJobText: string;
  autoRunKey: string | null;
};

function buildWorkspacePrefill({
  jobUrl,
  rawJobText,
}: {
  jobUrl: string;
  rawJobText: string;
}): WorkspacePrefill {
  const normalizedJobUrl = jobUrl.trim();
  const normalizedRawJobText = rawJobText.trim();
  const autoRunKey =
    normalizedJobUrl || normalizedRawJobText
      ? `prefill:${normalizedJobUrl}:${normalizedRawJobText}`
      : null;

  return {
    jobUrl: normalizedJobUrl,
    rawJobText: normalizedRawJobText,
    autoRunKey,
  };
}

function buildPayload(values: WorkspaceFormValues): PrepareApplicationBasePayload {
  return {
    candidate_profile: workspaceValuesToCandidateProfilePayload(values),
  };
}

function InfoBlock({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className={mono ? "mt-2 font-mono text-xs text-slate-900" : "mt-2 text-sm text-slate-800"}>
        {value}
      </p>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">
        {value}
      </p>
    </div>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      {items.length ? (
        <ul className="space-y-2 pl-5 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{t("common.states.none")}</p>
      )}
    </div>
  );
}
