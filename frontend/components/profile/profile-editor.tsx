"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/components/auth/auth-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getApiErrorMessage,
  getCandidateProfile,
  upsertCandidateProfile,
} from "@/lib/api";
import {
  candidateProfileToWorkspaceValues,
  formatProfileTimestamp,
  workspaceValuesToProfilePayload,
} from "@/lib/profile";
import { createCandidateProfileFormSchema } from "@/lib/schemas";
import type { CandidateProfileFormValues } from "@/types/api";

const defaultValues: CandidateProfileFormValues = {
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

export function ProfileEditor() {
  const { user } = useAuth();
  const { locale, t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<CandidateProfileFormValues>({
    resolver: zodResolver(
      createCandidateProfileFormSchema((key) => t(`validation.${key}`)),
    ),
    defaultValues,
  });

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setErrorMessage(null);

    void (async () => {
      try {
        const profile = await getCandidateProfile();
        if (!isActive) {
          return;
        }

        form.reset(candidateProfileToWorkspaceValues(profile));
        setStatusMessage(
          profile.updated_at
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
            fallback: t("profile.page.loadError"),
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
  }, [form, locale, t, user?.id]);

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSaving(true);

    try {
      const savedProfile = await upsertCandidateProfile(
        workspaceValuesToProfilePayload(values),
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
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("profile.page.saveError"),
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              {t("common.brandName")}
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {t("profile.page.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              {t("profile.page.description")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <LanguageSwitcher />
            <Link href="/onboarding" className="hover:text-slate-950">
              {t("common.navigation.onboarding")}
            </Link>
            <Link href="/search" className="hover:text-slate-950">
              {t("common.navigation.search")}
            </Link>
            <Link href="/workspace" className="hover:text-slate-950">
              {t("common.navigation.workspace")}
            </Link>
            <span className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700">
              {user?.full_name ?? t("common.states.account")}
            </span>
          </div>
        </div>

        <form
          className="rounded-[2.25rem] border border-slate-200 bg-white px-6 py-8 shadow-panel sm:px-8 sm:py-10"
          onSubmit={onSubmit}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">
                {t("profile.page.savedProfileTitle")}
              </p>
              <p className="text-sm text-slate-500">
                {t("profile.page.savedProfileDescription")}
              </p>
            </div>
            <Button type="submit" disabled={isLoading || isSaving}>
              {isSaving
                ? t("common.states.saving")
                : t("common.actions.saveProfile")}
            </Button>
          </div>

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {t("workspace.profile.loadingProfile")}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {statusMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-8 space-y-8">
            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {t("profile.page.basicProfileTitle")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("profile.page.basicProfileDescription")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["full_name", t("common.fields.fullName"), t("common.placeholders.fullName")],
                    ["email", t("common.fields.email"), t("common.placeholders.email")],
                    ["phone", t("common.fields.phone"), t("common.placeholders.phone")],
                    ["location", t("common.fields.location"), t("common.placeholders.location")],
                    [
                      "work_authorization",
                      t("common.fields.workAuthorization"),
                      t("common.placeholders.workAuthorization"),
                    ],
                  ] as const
                ).map(([field, label, placeholder]) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{label}</Label>
                    <Input id={field} placeholder={placeholder} {...form.register(field)} />
                    {form.formState.errors[field] ? (
                      <p className="text-sm text-red-700">
                        {form.formState.errors[field]?.message}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5 border-t border-slate-200 pt-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {t("profile.page.careerTitle")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("profile.page.careerDescription")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["target_role", t("common.fields.targetRole"), t("common.placeholders.targetRole")],
                    [
                      "years_of_experience",
                      t("common.fields.yearsOfExperience"),
                      t("common.placeholders.yearsOfExperience"),
                    ],
                    [
                      "remote_preference",
                      t("common.fields.remotePreference"),
                      t("common.placeholders.remotePreference"),
                    ],
                    [
                      "salary_expectation",
                      t("common.fields.salaryExpectation"),
                      t("common.placeholders.salaryExpectation"),
                    ],
                  ] as const
                ).map(([field, label, placeholder]) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{label}</Label>
                    <Input id={field} placeholder={placeholder} {...form.register(field)} />
                    {form.formState.errors[field] ? (
                      <p className="text-sm text-red-700">
                        {form.formState.errors[field]?.message}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_locations">
                  {t("common.fields.preferredLocations")}
                </Label>
                <Input
                  id="preferred_locations"
                  placeholder={t("common.placeholders.preferredLocations")}
                  {...form.register("preferred_locations")}
                />
                <p className="text-sm text-slate-500">{t("common.hints.csv")}</p>
                {form.formState.errors.preferred_locations ? (
                  <p className="text-sm text-red-700">
                    {form.formState.errors.preferred_locations.message}
                  </p>
                ) : null}
              </div>
            </section>

            <section className="space-y-5 border-t border-slate-200 pt-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {t("profile.page.backgroundTitle")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("profile.page.backgroundDescription")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="skills">{t("common.fields.skills")}</Label>
                  <Input
                    id="skills"
                    placeholder={t("common.placeholders.skills")}
                    {...form.register("skills")}
                  />
                  <p className="text-sm text-slate-500">{t("common.hints.csv")}</p>
                  {form.formState.errors.skills ? (
                    <p className="text-sm text-red-700">
                      {form.formState.errors.skills.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">{t("common.fields.languages")}</Label>
                  <Input
                    id="languages"
                    placeholder={t("common.placeholders.languages")}
                    {...form.register("languages")}
                  />
                  <p className="text-sm text-slate-500">{t("common.hints.csv")}</p>
                  {form.formState.errors.languages ? (
                    <p className="text-sm text-red-700">
                      {form.formState.errors.languages.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="professional_summary">
                  {t("common.fields.professionalSummary")}
                </Label>
                <Textarea
                  id="professional_summary"
                  className="min-h-[140px]"
                  placeholder={t("common.placeholders.professionalSummary")}
                  {...form.register("professional_summary")}
                />
                {form.formState.errors.professional_summary ? (
                  <p className="text-sm text-red-700">
                    {form.formState.errors.professional_summary.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv_text">{t("common.fields.cvText")}</Label>
                <Textarea
                  id="cv_text"
                  className="min-h-[220px]"
                  placeholder={t("common.placeholders.cvText")}
                  {...form.register("cv_text")}
                />
                {form.formState.errors.cv_text ? (
                  <p className="text-sm text-red-700">
                    {form.formState.errors.cv_text.message}
                  </p>
                ) : null}
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}
