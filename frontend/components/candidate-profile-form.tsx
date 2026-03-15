"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { useI18n } from "@/components/i18n/locale-provider";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { WorkspaceFormValues } from "@/types/api";

type CandidateProfileFormProps = {
  register: UseFormRegister<WorkspaceFormValues>;
  errors: FieldErrors<WorkspaceFormValues>;
  isProfileLoading: boolean;
  isSavingProfile: boolean;
  profileStatusMessage: string | null;
  profileErrorMessage: string | null;
  onSaveProfile: () => void;
};

export function CandidateProfileForm({
  register,
  errors,
  isProfileLoading,
  isSavingProfile,
  profileStatusMessage,
  profileErrorMessage,
  onSaveProfile,
}: CandidateProfileFormProps) {
  const { t } = useI18n();
  const fieldDescriptions: Record<string, string> = {
    skills: t("common.hints.skills"),
    languages: t("common.hints.languages"),
    preferred_locations: t("common.hints.preferredLocations"),
  };

  return (
    <SectionCard
      title={t("workspace.profile.title")}
      description={t("workspace.profile.description")}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">
              {t("workspace.profile.savedProfileTitle")}
            </p>
            <p className="text-xs text-slate-500">
              {t("workspace.profile.savedProfileDescription")}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onSaveProfile}
            disabled={isProfileLoading || isSavingProfile}
          >
            {isSavingProfile
              ? t("common.states.saving")
              : t("common.actions.saveProfile")}
          </Button>
        </div>

        {isProfileLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {t("workspace.profile.loadingProfile")}
          </div>
        ) : null}

        {profileStatusMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {profileStatusMessage}
          </div>
        ) : null}

        {profileErrorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {profileErrorMessage}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["full_name", t("common.fields.fullName"), t("common.placeholders.fullName")],
              ["email", t("common.fields.email"), t("common.placeholders.email")],
              ["phone", t("common.fields.phone"), t("common.placeholders.phone")],
              ["location", t("common.fields.location"), t("common.placeholders.location")],
              ["target_role", t("common.fields.targetRole"), t("common.placeholders.targetRole")],
              [
                "years_of_experience",
                t("common.fields.yearsOfExperience"),
                t("common.placeholders.yearsOfExperience"),
              ],
              [
                "work_authorization",
                t("common.fields.workAuthorization"),
                t("common.placeholders.workAuthorization"),
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
              <Input
                id={field}
                placeholder={placeholder}
                {...register(field)}
              />
              {errors[field] ? (
                <p className="text-sm text-red-600">{errors[field]?.message}</p>
              ) : null}
            </div>
          ))}
        </div>

        {(
          [
            ["skills", t("common.fields.skills")],
            ["languages", t("common.fields.languages")],
            ["preferred_locations", t("common.fields.preferredLocations")],
          ] as const
        ).map(([field, label]) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              placeholder={fieldDescriptions[field]}
              {...register(field)}
            />
            <p className="text-xs text-slate-500">{fieldDescriptions[field]}</p>
            {errors[field] ? (
              <p className="text-sm text-red-600">{errors[field]?.message}</p>
            ) : null}
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="professional_summary">
            {t("common.fields.professionalSummary")}
          </Label>
          <Textarea
            id="professional_summary"
            placeholder={t("common.placeholders.professionalSummary")}
            className="min-h-[120px]"
            {...register("professional_summary")}
          />
          {errors.professional_summary ? (
            <p className="text-sm text-red-600">
              {errors.professional_summary.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv_text">{t("common.fields.cvText")}</Label>
          <Textarea
            id="cv_text"
            placeholder={t("common.placeholders.cvText")}
            className="min-h-[180px]"
            {...register("cv_text")}
          />
          {errors.cv_text ? (
            <p className="text-sm text-red-600">{errors.cv_text.message}</p>
          ) : null}
        </div>
      </div>
    </SectionCard>
  );
}
