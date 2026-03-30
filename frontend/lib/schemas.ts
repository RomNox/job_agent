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

const onboardingTagListSchema = z.array(z.string().trim().min(1)).default([]);

function createRequiredOnboardingTextField(message: string) {
  return z.string().trim().min(1, message);
}

function createRequiredOnboardingYearField(
  requiredMessage: string,
  invalidMessage: string,
) {
  return z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine(
      (value) =>
        /^\d{4}$/.test(value) && Number(value) >= 1900 && Number(value) <= 2100,
      invalidMessage,
    );
}

function createOptionalOnboardingYearField(invalidMessage: string) {
  return z
    .string()
    .trim()
    .default("")
    .refine(
      (value) =>
        !value ||
        (/^\d{4}$/.test(value) &&
          Number(value) >= 1900 &&
          Number(value) <= 2100),
      invalidMessage,
    );
}

export const onboardingExperienceEntrySchema = z
  .object({
    job_title: z.string().default(""),
    company: z.string().default(""),
    location: z.string().default(""),
    start_date: z.string().default(""),
    end_date: z.string().default(""),
    responsibilities: z.string().default(""),
    technologies_used: onboardingTagListSchema,
  })
  .superRefine((value, ctx) => {
    const hasContent = Boolean(
      value.job_title.trim() ||
        value.company.trim() ||
        value.location.trim() ||
        value.start_date.trim() ||
        value.end_date.trim() ||
        value.responsibilities.trim() ||
        value.technologies_used.length,
    );
    if (!hasContent) {
      return;
    }

    if (!value.job_title.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["job_title"],
        message: "Enter the job title.",
      });
    }

    if (!value.company.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company"],
        message: "Enter the company name.",
      });
    }

    if (!value.start_date.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start_date"],
        message: "Enter the start date.",
      });
    }
  });

export const onboardingEducationEntrySchema = z
  .object({
    institution: z.string().default(""),
    degree: z.string().default(""),
    field_of_study: z.string().default(""),
    start_year: createOptionalOnboardingYearField("Enter a valid start year."),
    end_year: createOptionalOnboardingYearField("Enter a valid end year."),
  })
  .superRefine((value, ctx) => {
    const hasContent = Boolean(
      value.institution.trim() ||
        value.degree.trim() ||
        value.field_of_study.trim() ||
        value.start_year.trim() ||
        value.end_year.trim(),
    );
    if (!hasContent) {
      return;
    }

    if (!value.institution.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["institution"],
        message: "Enter the institution name.",
      });
    }
  });

export const onboardingLanguageEntrySchema = z
  .object({
    language: z.string().default(""),
    level: z.string().default(""),
  })
  .superRefine((value, ctx) => {
    const hasContent = Boolean(value.language.trim() || value.level.trim());
    if (!hasContent) {
      return;
    }

    if (!value.language.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["language"],
        message: "Enter the language.",
      });
    }

    if (!value.level.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["level"],
        message: "Enter the level.",
      });
    }
  });

export const resumeAddressSchema = z.object({
  street: z.string().default(""),
  city: z.string().default(""),
  postal_code: z.string().default(""),
  country: z.string().default(""),
});

export const resumeUserProfileSchema = z.object({
  first_name: z.string().default(""),
  last_name: z.string().default(""),
  birth_year: z.number().int().nullable(),
  email: z.string(),
  phone: z.string(),
  address: resumeAddressSchema,
});

export const resumePreferencesSchema = z.object({
  work_authorization_status: z.string(),
  years_of_experience: z.number().int().nullable(),
  preferred_locations: onboardingTagListSchema,
  work_mode: z.string(),
  salary_expectation: z.string(),
  availability: z.string(),
});

export const resumeExperienceEntryResponseSchema = z.object({
  job_title: z.string(),
  company: z.string(),
  location: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  responsibilities: z.string(),
  technologies_used: onboardingTagListSchema,
});

export const resumeEducationEntryResponseSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field_of_study: z.string(),
  start_year: z.number().int().nullable(),
  end_year: z.number().int().nullable(),
});

export const resumeLanguageEntryResponseSchema = z.object({
  language: z.string(),
  level: z.string(),
});

export const resumeProfileSchema = z.object({
  professional_title: z.string(),
  summary: z.string(),
  experience: z.array(resumeExperienceEntryResponseSchema),
  education: z.array(resumeEducationEntryResponseSchema),
  skills: onboardingTagListSchema,
  languages: z.array(resumeLanguageEntryResponseSchema),
  preferences: resumePreferencesSchema,
});

export const onboardingResumeFormSchema = z.object({
  start_method: z.enum(["guided", "upload"]).default("guided"),
  resume_reference_text: z.string().default(""),
  user: z.object({
    first_name: createRequiredOnboardingTextField("Enter your first name."),
    last_name: createRequiredOnboardingTextField("Enter your last name."),
    birth_year: createRequiredOnboardingYearField(
      "Enter your birth year.",
      "Enter a valid birth year.",
    ),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email address.")
      .email("Enter a valid email address."),
    phone: createRequiredOnboardingTextField("Enter your phone number."),
    address: z.object({
      street: createRequiredOnboardingTextField("Enter your street."),
      city: createRequiredOnboardingTextField("Enter your city."),
      postal_code: createRequiredOnboardingTextField("Enter your postal code."),
      country: createRequiredOnboardingTextField("Enter your country."),
    }),
  }),
  resume: z.object({
    professional_title: createRequiredOnboardingTextField(
      "Enter your desired role.",
    ),
    summary: z.string().default(""),
    experience: z.array(onboardingExperienceEntrySchema).default([]),
    education: z.array(onboardingEducationEntrySchema).default([]),
    skills: onboardingTagListSchema,
    languages: z.array(onboardingLanguageEntrySchema).default([]),
    preferences: z.object({
      work_authorization_status: createRequiredOnboardingTextField(
        "Select your work authorization status.",
      ),
      years_of_experience: z
        .string()
        .trim()
        .min(1, "Enter your years of experience.")
        .refine((value) => /^\d+$/.test(value), "Use a whole number."),
      preferred_locations: onboardingTagListSchema,
      work_mode: z.string().default(""),
      salary_expectation: z.string().default(""),
      availability: z.string().default(""),
    }),
  }),
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
  user: resumeUserProfileSchema,
  resume: resumeProfileSchema,
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
