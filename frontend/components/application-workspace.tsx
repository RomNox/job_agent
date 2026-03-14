"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { CandidateProfileForm } from "@/components/candidate-profile-form";
import { ChecklistCard } from "@/components/checklist-card";
import { CoverLetterCard } from "@/components/cover-letter-card";
import { CVTailoringCard } from "@/components/cv-tailoring-card";
import { JobInputForm } from "@/components/job-input-form";
import { MatchResultCard } from "@/components/match-result-card";
import { ProgressIndicator } from "@/components/progress-indicator";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { parseJob, prepareApplication } from "@/lib/api";
import { workspaceFormSchema } from "@/lib/schemas";
import type {
  ApplicationPackageResponse,
  CandidateProfilePayload,
  ParsedJobResponse,
  PrepareApplicationBasePayload,
  PrepareApplicationPayload,
  WorkspaceFormValues,
} from "@/types/api";

type WorkflowStep = "idle" | "parsing" | "preparing" | "done";

const defaultValues: WorkspaceFormValues = {
  job_url: "",
  raw_job_text: "",
  full_name: "",
  summary: "",
  skills: "",
  desired_roles: "",
  desired_locations: "",
  languages: "",
};

export function ApplicationWorkspace() {
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues,
  });

  const [parsedJob, setParsedJob] = useState<ParsedJobResponse | null>(null);
  const [applicationPackage, setApplicationPackage] =
    useState<ApplicationPackageResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("idle");

  const watchedUrl = form.watch("job_url");
  const watchedRawText = form.watch("raw_job_text");
  const prefersRawText = Boolean(watchedUrl.trim() && watchedRawText.trim());

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null);
    setParsedJob(null);
    setApplicationPackage(null);

    try {
      const payloadBase = buildPayload(values);
      const rawJobText = values.raw_job_text.trim();
      const jobUrl = values.job_url.trim();

      if (rawJobText) {
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
        error instanceof Error
          ? error.message
          : "Something went wrong while preparing the application package.",
      );
    }
  });

  const hasResults = Boolean(parsedJob || applicationPackage);
  const resultsTitle = useMemo(() => {
    if (applicationPackage) {
      return applicationPackage.job_posting.title;
    }
    if (parsedJob?.page_title) {
      return parsedJob.page_title;
    }
    return "Results will appear here";
  }, [applicationPackage, parsedJob]);

  return (
    <main className="surface-grid min-h-screen bg-slate-50/60">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 shadow-panel backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Job agent workspace
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Prepare a complete application package
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                  Use a job URL or raw job text, add the candidate profile, and
                  assemble the full backend package in one workflow-oriented screen.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Backend assumed at{" "}
                <span className="font-mono text-xs text-slate-900">
                  http://127.0.0.1:8000
                </span>
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
                />

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
                      ? "Parsing job page..."
                      : "Preparing application..."
                    : "Prepare Application"}
                </Button>
              </form>
            </section>

            <section className="space-y-6">
              <SectionCard
                title={resultsTitle}
                description={
                  hasResults
                    ? "Structured output from the backend workflow."
                    : "Submit the form to render the parsed job, fit analysis, draft cover letter, CV tailoring notes, and the final checklist."
                }
              >
                {!hasResults ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm leading-7 text-slate-500">
                    This workspace is product-first rather than chat-first. Once you
                    submit the form, each backend workflow artifact will appear here as a
                    separate review card.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {parsedJob ? (
                      <SectionCard
                        title="Parsed Job"
                        description="Readable text extracted from the job page before the application package call."
                        className="border-dashed shadow-none"
                      >
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <InfoBlock label="Source URL" value={parsedJob.source_url} mono />
                            <InfoBlock
                              label="Detected source"
                              value={parsedJob.detected_source ?? "Unknown"}
                            />
                          </div>
                          <InfoBlock
                            label="Page title"
                            value={parsedJob.page_title ?? "Unavailable"}
                          />
                          <TextBlock label="Raw text" value={parsedJob.raw_text} />
                          {parsedJob.extraction_warnings.length ? (
                            <BulletSection
                              title="Extraction warnings"
                              items={parsedJob.extraction_warnings}
                            />
                          ) : null}
                        </div>
                      </SectionCard>
                    ) : null}

                    {applicationPackage ? (
                      <>
                        <SectionCard
                          title="Job Posting"
                          description="Structured job payload used to assemble the package."
                          className="border-dashed shadow-none"
                        >
                          <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              <InfoBlock
                                label="Employer"
                                value={applicationPackage.job_posting.employer}
                              />
                              <InfoBlock
                                label="Location"
                                value={applicationPackage.job_posting.location}
                              />
                              <InfoBlock
                                label="Employment type"
                                value={applicationPackage.job_posting.employment_type}
                              />
                              <InfoBlock
                                label="Language"
                                value={applicationPackage.job_posting.language}
                              />
                            </div>
                            <TextBlock
                              label="Summary"
                              value={applicationPackage.job_posting.summary}
                            />
                            <div className="grid gap-5 md:grid-cols-2">
                              <BulletSection
                                title="Requirements"
                                items={applicationPackage.job_posting.requirements}
                              />
                              <BulletSection
                                title="Missing information"
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

function buildPayload(values: WorkspaceFormValues): PrepareApplicationBasePayload {
  const candidateProfile: CandidateProfilePayload = {
    full_name: values.full_name.trim(),
  };

  const summary = values.summary.trim();
  const skills = splitCsv(values.skills);
  const desiredRoles = splitCsv(values.desired_roles);
  const desiredLocations = splitCsv(values.desired_locations);
  const languages = splitCsv(values.languages);

  if (summary) {
    candidateProfile.summary = summary;
  }
  if (skills.length) {
    candidateProfile.skills = skills;
  }
  if (desiredRoles.length) {
    candidateProfile.desired_roles = desiredRoles;
  }
  if (desiredLocations.length) {
    candidateProfile.desired_locations = desiredLocations;
  }
  if (languages.length) {
    candidateProfile.languages = languages;
  }

  return {
    candidate_profile: candidateProfile,
  };
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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
        <p className="text-sm text-slate-500">None.</p>
      )}
    </div>
  );
}
