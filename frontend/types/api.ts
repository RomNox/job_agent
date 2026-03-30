import type { z } from "zod";

import {
  applicationPackageSchema,
  authStatusSchema,
  authUserSchema,
  candidateProfileFormSchema,
  candidateProfileResponseSchema,
  jobSearchResponseSchema,
  onboardingResumeFormSchema,
  jobSearchResultSchema,
  loginFormSchema,
  jobPostingSchema,
  parsedJobSchema,
  resolvedJobContentSchema,
  signupFormSchema,
  onboardingStateSchema,
  workspaceFormSchema,
} from "@/lib/schemas";

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type CandidateProfileFormValues = z.infer<typeof candidateProfileFormSchema>;
export type OnboardingResumeFormValues = z.infer<typeof onboardingResumeFormSchema>;
export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
export type ParsedJobResponse = z.infer<typeof parsedJobSchema>;
export type JobPostingResponse = z.infer<typeof jobPostingSchema>;
export type ApplicationPackageResponse = z.infer<typeof applicationPackageSchema>;
export type JobSearchResult = z.infer<typeof jobSearchResultSchema>;
export type JobSearchResponse = z.infer<typeof jobSearchResponseSchema>;
export type ResolvedJobContent = z.infer<typeof resolvedJobContentSchema>;
export type AuthUserResponse = z.infer<typeof authUserSchema>;
export type AuthStatusResponse = z.infer<typeof authStatusSchema>;
export type CandidateProfileResponse = z.infer<typeof candidateProfileResponseSchema>;
export type OnboardingStateResponse = z.infer<typeof onboardingStateSchema>;
export type ResumeUserProfile = CandidateProfileResponse["user"];
export type ResumeProfileData = CandidateProfileResponse["resume"];
export type ResumeExperienceEntry = ResumeProfileData["experience"][number];
export type ResumeEducationEntry = ResumeProfileData["education"][number];
export type ResumeLanguageEntry = ResumeProfileData["languages"][number];

export type CandidateProfilePayload = {
  full_name: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experience_years?: number;
  desired_roles?: string[];
  desired_locations?: string[];
  languages?: string[];
};

export type PrepareApplicationBasePayload = {
  candidate_profile: CandidateProfilePayload;
};

export type PrepareApplicationPayload =
  | {
      candidate_profile: CandidateProfilePayload;
      raw_text: string;
      source_url?: string;
      job_posting?: never;
    }
  | {
      candidate_profile: CandidateProfilePayload;
      job_posting: JobPostingResponse;
      raw_text?: never;
      source_url?: never;
    };

export type SearchJobsPayload = {
  keywords: string;
  location?: string;
  remote_only?: boolean;
  employment_type?: string;
  page?: number;
  results_per_page?: number;
  source?: "jooble";
};

export type SearchSelectedJobPayload = {
  id: string;
  source: string;
  external_id?: string | null;
  title: string;
  company?: string | null;
  location?: string | null;
  salary?: string | null;
  employment_type?: string | null;
  posted_at?: string | null;
  url: string;
  snippet?: string | null;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UpsertCandidateProfilePayload = {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  target_role: string;
  years_of_experience: number | null;
  skills: string;
  languages: string;
  work_authorization: string;
  remote_preference: string;
  preferred_locations: string;
  salary_expectation: string;
  professional_summary: string;
  cv_text: string;
  user?: CandidateProfileResponse["user"];
  resume?: CandidateProfileResponse["resume"];
};

export type UpdateOnboardingStatePayload = {
  current_step: number;
  completed: boolean;
};
