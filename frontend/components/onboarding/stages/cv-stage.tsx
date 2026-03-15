"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { OnboardingStageFormProps } from "./shared";

export function CvStage({ register, errors }: OnboardingStageFormProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-5">
      <div className="space-y-2">
        <Label htmlFor="cv_text">{t("common.fields.cvText")}</Label>
        <Textarea
          id="cv_text"
          className="min-h-[260px]"
          placeholder={t("common.placeholders.cvText")}
          {...register("cv_text")}
        />
        <p className="text-sm text-slate-500">
          {t("onboarding.cv.hint")}
        </p>
        {errors.cv_text ? (
          <p className="text-sm text-red-700">{errors.cv_text.message}</p>
        ) : null}
      </div>
    </div>
  );
}
