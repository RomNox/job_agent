"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { useI18n } from "@/components/i18n/locale-provider";
import { ONBOARDING_STAGES } from "@/lib/onboarding";
import type { CandidateProfileFormValues } from "@/types/api";

import { BasicProfileStage } from "./stages/basic-profile-stage";
import { CareerGoalStage } from "./stages/career-goal-stage";
import { ConfirmationStage } from "./stages/confirmation-stage";
import { CvStage } from "./stages/cv-stage";
import { ExperienceSkillsStage } from "./stages/experience-skills-stage";
import { IntroductionStage } from "./stages/introduction-stage";
import { JobPreferencesStage } from "./stages/job-preferences-stage";

type OnboardingStageContentProps = {
  stepIndex: number;
  register: UseFormRegister<CandidateProfileFormValues>;
  errors: FieldErrors<CandidateProfileFormValues>;
  values: CandidateProfileFormValues;
  userName?: string | null;
  finalActionLabel: string;
  completed: boolean;
};

export function OnboardingStageContent({
  stepIndex,
  register,
  errors,
  values,
  userName,
  finalActionLabel,
  completed,
}: OnboardingStageContentProps) {
  const { messages, t } = useI18n();
  const stage = messages.onboarding.stages[stepIndex];
  const stageId = ONBOARDING_STAGES[stepIndex];

  return (
    <div key={stageId.id} className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {t("onboarding.page.stepCounter", {
            current: stepIndex + 1,
            total: ONBOARDING_STAGES.length,
          })}
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {stage.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            {stage.description}
          </p>
        </div>
      </div>

      {renderStage({
        stepIndex,
        register,
        errors,
        values,
        userName,
        finalActionLabel,
        completed,
      })}
    </div>
  );
}

function renderStage({
  stepIndex,
  register,
  errors,
  values,
  userName,
  finalActionLabel,
  completed,
}: OnboardingStageContentProps) {
  switch (stepIndex) {
    case 0:
      return <IntroductionStage isActive userName={userName} />;
    case 1:
      return <CareerGoalStage register={register} errors={errors} />;
    case 2:
      return <BasicProfileStage register={register} errors={errors} />;
    case 3:
      return <ExperienceSkillsStage register={register} errors={errors} />;
    case 4:
      return <JobPreferencesStage register={register} errors={errors} />;
    case 5:
      return <CvStage register={register} errors={errors} />;
    case 6:
      return (
        <ConfirmationStage
          values={values}
          nextLabel={finalActionLabel}
          completed={completed}
        />
      );
    default:
      return null;
  }
}
