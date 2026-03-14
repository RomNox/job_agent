import type { z } from "zod";

import {
  applicationPackageSchema,
  candidateProfileFormSchema,
  jobPostingSchema,
  parsedJobSchema,
  workspaceFormSchema,
} from "@/lib/schemas";

export type CandidateProfileFormValues = z.infer<typeof candidateProfileFormSchema>;
export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
export type ParsedJobResponse = z.infer<typeof parsedJobSchema>;
export type JobPostingResponse = z.infer<typeof jobPostingSchema>;
export type ApplicationPackageResponse = z.infer<typeof applicationPackageSchema>;

export type CandidateProfilePayload = {
  full_name: string;
  summary?: string;
  skills?: string[];
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
