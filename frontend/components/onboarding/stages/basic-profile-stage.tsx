"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { OnboardingStageFormProps } from "./shared";

export function BasicProfileStage({
  register,
  errors,
}: OnboardingStageFormProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="full_name">{t("common.fields.fullName")}</Label>
        <Input
          id="full_name"
          placeholder={t("common.placeholders.fullName")}
          {...register("full_name")}
        />
        {errors.full_name ? (
          <p className="text-sm text-red-700">{errors.full_name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("common.fields.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("common.placeholders.email")}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-700">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t("common.fields.phone")}</Label>
        <Input
          id="phone"
          placeholder={t("common.placeholders.phone")}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-sm text-red-700">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">{t("common.fields.location")}</Label>
        <Input
          id="location"
          placeholder={t("common.placeholders.location")}
          {...register("location")}
        />
        {errors.location ? (
          <p className="text-sm text-red-700">{errors.location.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="work_authorization">
          {t("common.fields.workAuthorization")}
        </Label>
        <Input
          id="work_authorization"
          placeholder={t("common.placeholders.workAuthorization")}
          {...register("work_authorization")}
        />
        {errors.work_authorization ? (
          <p className="text-sm text-red-700">
            {errors.work_authorization.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
