"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { OnboardingStageFormProps } from "./shared";

export function CareerGoalStage({
  register,
  errors,
}: OnboardingStageFormProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-5">
      <div className="space-y-2">
        <Label htmlFor="target_role">{t("common.fields.targetRole")}</Label>
        <Input
          id="target_role"
          placeholder={t("common.placeholders.targetRole")}
          {...register("target_role")}
        />
        <p className="text-sm text-slate-500">
          {t("onboarding.careerGoal.targetHint")}
        </p>
        {errors.target_role ? (
          <p className="text-sm text-red-700">{errors.target_role.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_locations">
          {t("common.fields.preferredLocations")}
        </Label>
        <Input
          id="preferred_locations"
          placeholder={t("common.placeholders.preferredLocations")}
          {...register("preferred_locations")}
        />
        <p className="text-sm text-slate-500">
          {t("onboarding.careerGoal.locationsHint")}
        </p>
        {errors.preferred_locations ? (
          <p className="text-sm text-red-700">
            {errors.preferred_locations.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="remote_preference">
          {t("common.fields.remotePreference")}
        </Label>
        <Input
          id="remote_preference"
          placeholder={t("common.placeholders.remotePreference")}
          {...register("remote_preference")}
        />
        {errors.remote_preference ? (
          <p className="text-sm text-red-700">
            {errors.remote_preference.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
