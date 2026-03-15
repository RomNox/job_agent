"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import type { CandidateProfileFormValues } from "@/types/api";

type ConfirmationStageProps = {
  values: CandidateProfileFormValues;
  nextLabel: string;
  completed: boolean;
};

export function ConfirmationStage({
  values,
  nextLabel,
  completed,
}: ConfirmationStageProps) {
  const { t } = useI18n();
  const summaryGroups = [
    {
      title: t("onboarding.confirmation.groups.direction"),
      fields: [
        [t("common.fields.targetRole"), "target_role"],
        [t("common.fields.preferredLocations"), "preferred_locations"],
        [t("common.fields.remotePreference"), "remote_preference"],
      ],
    },
    {
      title: t("onboarding.confirmation.groups.profile"),
      fields: [
        [t("common.fields.fullName"), "full_name"],
        [t("common.fields.email"), "email"],
        [t("common.fields.phone"), "phone"],
        [t("common.fields.location"), "location"],
        [t("common.fields.workAuthorization"), "work_authorization"],
      ],
    },
    {
      title: t("onboarding.confirmation.groups.background"),
      fields: [
        [t("common.fields.yearsOfExperience"), "years_of_experience"],
        [t("common.fields.skills"), "skills"],
        [t("common.fields.languages"), "languages"],
        [t("common.fields.salaryExpectation"), "salary_expectation"],
      ],
    },
  ] as const satisfies readonly {
    title: string;
    fields: readonly [string, keyof CandidateProfileFormValues][];
  }[];

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-5 py-5">
        <p className="text-sm font-medium text-slate-900">
          {completed
            ? t("onboarding.confirmation.completedTitle")
            : t("onboarding.confirmation.readyTitle")}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t("onboarding.confirmation.description", {
            nextAction: nextLabel.toLowerCase(),
          })}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {summaryGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5"
          >
            <p className="text-sm font-semibold text-slate-950">{group.title}</p>
            <div className="mt-4 space-y-3">
              {group.fields.map(([label, field]) => (
                <div key={field}>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {values[field]?.trim() || t("common.states.notProvided")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-dashed border-slate-200 px-5 py-5 text-sm leading-7 text-slate-600">
        {t("onboarding.confirmation.nextStepDescription")}
      </div>
    </div>
  );
}
