"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { OnboardingStageFormProps } from "./shared";

export function ExperienceSkillsStage({
  register,
  errors,
}: OnboardingStageFormProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="years_of_experience">
            {t("common.fields.yearsOfExperience")}
          </Label>
          <Input
            id="years_of_experience"
            placeholder={t("common.placeholders.yearsOfExperience")}
            {...register("years_of_experience")}
          />
          {errors.years_of_experience ? (
            <p className="text-sm text-red-700">
              {errors.years_of_experience.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="skills">{t("common.fields.skills")}</Label>
          <Input
            id="skills"
            placeholder={t("common.placeholders.skills")}
            {...register("skills")}
          />
          <p className="text-sm text-slate-500">{t("common.hints.csv")}</p>
          {errors.skills ? (
            <p className="text-sm text-red-700">{errors.skills.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages">{t("common.fields.languages")}</Label>
        <Input
          id="languages"
          placeholder={t("common.placeholders.languages")}
          {...register("languages")}
        />
        <p className="text-sm text-slate-500">{t("common.hints.csv")}</p>
        {errors.languages ? (
          <p className="text-sm text-red-700">{errors.languages.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="professional_summary">
          {t("common.fields.professionalSummary")}
        </Label>
        <Textarea
          id="professional_summary"
          className="min-h-[160px]"
          placeholder={t("common.placeholders.professionalSummary")}
          {...register("professional_summary")}
        />
        {errors.professional_summary ? (
          <p className="text-sm text-red-700">
            {errors.professional_summary.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
