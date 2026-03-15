"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { useI18n } from "@/components/i18n/locale-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/section-card";
import type { WorkspaceFormValues } from "@/types/api";

type JobInputFormProps = {
  register: UseFormRegister<WorkspaceFormValues>;
  errors: FieldErrors<WorkspaceFormValues>;
  prefersRawText: boolean;
};

export function JobInputForm({
  register,
  errors,
  prefersRawText,
}: JobInputFormProps) {
  const { t } = useI18n();

  return (
    <SectionCard
      title={t("workspace.jobInput.title")}
      description={t("workspace.jobInput.description")}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job_url">{t("common.fields.jobUrl")}</Label>
          <Input
            id="job_url"
            placeholder={t("common.placeholders.jobUrl")}
            {...register("job_url")}
          />
          {errors.job_url ? (
            <p className="text-sm text-red-600">{errors.job_url.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="raw_job_text">{t("common.fields.rawJobText")}</Label>
          <Textarea
            id="raw_job_text"
            placeholder={t("common.placeholders.rawJobText")}
            {...register("raw_job_text")}
          />
          {errors.raw_job_text ? (
            <p className="text-sm text-red-600">{errors.raw_job_text.message}</p>
          ) : null}
        </div>

        {prefersRawText ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {t("workspace.jobInput.rawTextNotice")}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
