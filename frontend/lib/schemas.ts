import { z } from "zod";

const csvFieldSchema = z.string().default("");
const optionalTextFieldSchema = z.string().default("");
type TranslateFn = (key: ValidationKey) => string;

type ValidationKey =
  | "emailRequired"
  | "emailInvalid"
  | "passwordRequired"
  | "passwordMin"
  | "fullNameMin"
  | "fullNameRequired"
  | "yearsInteger"
  | "jobUrlInvalid"
  | "jobInputRequired";

const defaultValidationText: Record<ValidationKey, string> = {
  emailRequired: "E-Mail ist erforderlich.",
  emailInvalid: "Gültige E-Mail-Adresse eingeben.",
  passwordRequired: "Passwort ist erforderlich.",
  passwordMin: "Das Passwort muss mindestens 8 Zeichen lang sein.",
  fullNameMin: "Der vollständige Name muss mindestens 2 Zeichen haben.",
  fullNameRequired: "Der vollständige Name ist erforderlich.",
  yearsInteger: "Für die Berufserfahrung bitte eine ganze Zahl verwenden.",
  jobUrlInvalid: "Gültige Job-URL eingeben.",
  jobInputRequired: "Bitte entweder eine Job-URL oder Rohtext eingeben.",
};

function getValidationText(key: ValidationKey) {
  return defaultValidationText[key];
}

function createOptionalEmailFieldSchema(t: TranslateFn) {
  return z
    .string()
    .trim()
    .default("")
    .refine((value) => !value || isValidEmail(value), t("emailInvalid"));
}

function createOptionalYearsFieldSchema(t: TranslateFn) {
  return z
    .string()
    .trim()
    .default("")
    .refine((value) => !value || /^\d+$/.test(value), t("yearsInteger"));
}

export function createLoginFormSchema(t: TranslateFn = getValidationText) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  });
}

export const loginFormSchema = createLoginFormSchema();

export function createSignupFormSchema(t: TranslateFn = getValidationText) {
  return z.object({
    full_name: z.string().trim().min(2, t("fullNameMin")),
    email: z
      .string()
      .trim()
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),
    password: z.string().min(8, t("passwordMin")),
  });
}

export const signupFormSchema = createSignupFormSchema();

export function createCandidateProfileFormSchema(t: TranslateFn = getValidationText) {
  return z.object({
    full_name: z.string().trim().min(1, t("fullNameRequired")),
    email: createOptionalEmailFieldSchema(t),
    phone: optionalTextFieldSchema,
    location: optionalTextFieldSchema,
    target_role: optionalTextFieldSchema,
    years_of_experience: createOptionalYearsFieldSchema(t),
    skills: csvFieldSchema,
    languages: csvFieldSchema,
    work_authorization: optionalTextFieldSchema,
    remote_preference: optionalTextFieldSchema,
    preferred_locations: csvFieldSchema,
    salary_expectation: optionalTextFieldSchema,
    professional_summary: z.string().default(""),
    cv_text: z.string().default(""),
  });
}

export const candidateProfileFormSchema = createCandidateProfileFormSchema();

export function createWorkspaceFormSchema(t: TranslateFn = getValidationText) {
  return createCandidateProfileFormSchema(t)
    .extend({
      job_url: z
        .string()
        .trim()
        .default("")
        .refine((value) => !value || isValidUrl(value), t("jobUrlInvalid")),
      raw_job_text: z.string().default(""),
    })
    .superRefine((values, ctx) => {
      if (!values.job_url.trim() && !values.raw_job_text.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["job_url"],
          message: t("jobInputRequired"),
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["raw_job_text"],
          message: t("jobInputRequired"),
        });
      }
    });
}

export const workspaceFormSchema = createWorkspaceFormSchema();

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

export const jobSearchResultSchema = z.object({
  id: z.string(),
  source: z.string(),
  external_id: z.string().nullable(),
  title: z.string(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  salary: z.string().nullable(),
  employment_type: z.string().nullable(),
  posted_at: z.string().nullable(),
  url: z.string().min(1),
  snippet: z.string().nullable(),
  fit_score: z.number().nullable(),
  fit_reason: z.string().nullable(),
});

export const jobSearchResponseSchema = z.object({
  source: z.string(),
  count: z.number().int().nonnegative(),
  results: z.array(jobSearchResultSchema),
});

export const resolvedJobContentSchema = z.object({
  title: z.string(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  salary: z.string().nullable(),
  employment_type: z.string().nullable(),
  posted_at: z.string().nullable(),
  source: z.string(),
  source_url: z.string().min(1),
  raw_text: z.string().min(1),
  content_quality: z.enum(["full", "partial", "preview"]),
  fetch_method: z.enum(["page_parse", "search_preview"]),
  resolution_notes: z.string().nullable(),
});

export const authUserSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
});

export const authStatusSchema = z.object({
  authenticated: z.boolean(),
  user: authUserSchema.nullable(),
});

export const candidateProfileResponseSchema = z.object({
  user_id: z.string(),
  full_name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  target_role: z.string(),
  years_of_experience: z.number().int().nullable(),
  skills: z.string(),
  languages: z.string(),
  work_authorization: z.string(),
  remote_preference: z.string(),
  preferred_locations: z.string(),
  salary_expectation: z.string(),
  professional_summary: z.string(),
  cv_text: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const onboardingStateSchema = z.object({
  user_id: z.string(),
  current_step: z.number().int().nonnegative(),
  furthest_step: z.number().int().nonnegative(),
  completed: z.boolean(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  try {
    return z.string().email().safeParse(value).success;
  } catch {
    return false;
  }
}
