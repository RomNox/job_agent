import { z } from "zod";

const csvFieldSchema = z.string().default("");

export const candidateProfileFormSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required."),
  summary: z.string().default(""),
  skills: csvFieldSchema,
  desired_roles: csvFieldSchema,
  desired_locations: csvFieldSchema,
  languages: csvFieldSchema,
});

export const workspaceFormSchema = candidateProfileFormSchema
  .extend({
    job_url: z
      .string()
      .trim()
      .default("")
      .refine((value) => !value || isValidUrl(value), "Enter a valid job URL."),
    raw_job_text: z.string().default(""),
  })
  .superRefine((values, ctx) => {
    if (!values.job_url.trim() && !values.raw_job_text.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["job_url"],
        message: "Provide either a job URL or raw job text.",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["raw_job_text"],
        message: "Provide either a job URL or raw job text.",
      });
    }
  });

export const parsedJobSchema = z.object({
  source_url: z.string(),
  page_title: z.string().nullable(),
  raw_text: z.string(),
  detected_source: z.string().nullable(),
  extraction_warnings: z.array(z.string()),
});

export const jobPostingSchema = z.object({
  title: z.string(),
  employer: z.string(),
  location: z.string(),
  employment_type: z.string(),
  language: z.string(),
  requirements: z.array(z.string()),
  summary: z.string(),
  missing_information: z.array(z.string()),
});

export const matchResultSchema = z.object({
  match_score: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommended_next_steps: z.array(z.string()),
});

export const coverLetterSchema = z.object({
  cover_letter: z.string(),
  key_points_used: z.array(z.string()),
  warnings: z.array(z.string()),
});

export const cvTailoringSchema = z.object({
  tailored_summary: z.string(),
  highlighted_skills: z.array(z.string()),
  suggested_experience_points: z.array(z.string()),
  warnings: z.array(z.string()),
});

export const applicationPackageSchema = z.object({
  job_posting: jobPostingSchema,
  match_result: matchResultSchema,
  cover_letter: coverLetterSchema,
  cv_tailoring: cvTailoringSchema,
  checklist: z.array(z.string()),
  warnings: z.array(z.string()),
});

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
