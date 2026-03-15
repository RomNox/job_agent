import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { CandidateProfileFormValues } from "@/types/api";

export type OnboardingStageFormProps = {
  register: UseFormRegister<CandidateProfileFormValues>;
  errors: FieldErrors<CandidateProfileFormValues>;
};
