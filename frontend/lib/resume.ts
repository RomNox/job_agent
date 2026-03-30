import type {
  CandidateProfileResponse,
  OnboardingResumeFormValues,
  ResumeEducationEntry,
  ResumeExperienceEntry,
  ResumeLanguageEntry,
  UpsertCandidateProfilePayload,
} from "@/types/api";

export function createEmptyExperienceEntry(): OnboardingResumeFormValues["resume"]["experience"][number] {
  return {
    job_title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    responsibilities: "",
    technologies_used: [],
  };
}

export function createEmptyEducationEntry(): OnboardingResumeFormValues["resume"]["education"][number] {
  return {
    institution: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
  };
}

export function createEmptyLanguageEntry(): OnboardingResumeFormValues["resume"]["languages"][number] {
  return {
    language: "",
    level: "",
  };
}

export const defaultOnboardingResumeValues: OnboardingResumeFormValues = {
  start_method: "guided",
  resume_reference_text: "",
  user: {
    first_name: "",
    last_name: "",
    birth_year: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      postal_code: "",
      country: "",
    },
  },
  resume: {
    professional_title: "",
    summary: "",
    experience: [createEmptyExperienceEntry()],
    education: [createEmptyEducationEntry()],
    skills: [],
    languages: [createEmptyLanguageEntry()],
    preferences: {
      work_authorization_status: "",
      years_of_experience: "",
      preferred_locations: [],
      work_mode: "",
      salary_expectation: "",
      availability: "",
    },
  },
};

export function candidateProfileToOnboardingValues(
  profile: CandidateProfileResponse,
): OnboardingResumeFormValues {
  const experience =
    profile.resume.experience.length > 0
      ? profile.resume.experience.map(mapExperienceEntryToForm)
      : [createEmptyExperienceEntry()];
  const education =
    profile.resume.education.length > 0
      ? profile.resume.education.map(mapEducationEntryToForm)
      : [createEmptyEducationEntry()];
  const languages =
    profile.resume.languages.length > 0
      ? profile.resume.languages.map((entry) => ({
          language: entry.language,
          level: entry.level,
        }))
      : [createEmptyLanguageEntry()];
  const generatedResumeText = buildResumeText({
    fullName: joinFullName(profile.user.first_name, profile.user.last_name),
    location: formatLocation(profile.user.address.city, profile.user.address.country),
    professionalTitle: profile.resume.professional_title,
    summary: profile.resume.summary,
    skills: normalizeTagList(profile.resume.skills),
    languages,
    experience,
    education,
  });
  const referenceText =
    profile.cv_text.trim() && profile.cv_text.trim() !== generatedResumeText.trim()
      ? profile.cv_text
      : "";

  return {
    start_method: referenceText ? "upload" : "guided",
    resume_reference_text: referenceText,
    user: {
      first_name: profile.user.first_name,
      last_name: profile.user.last_name,
      birth_year: profile.user.birth_year?.toString() ?? "",
      email: profile.user.email,
      phone: profile.user.phone,
      address: {
        street: profile.user.address.street,
        city: profile.user.address.city,
        postal_code: profile.user.address.postal_code,
        country: profile.user.address.country,
      },
    },
    resume: {
      professional_title: profile.resume.professional_title,
      summary: profile.resume.summary,
      experience,
      education,
      skills: normalizeTagList(profile.resume.skills),
      languages,
      preferences: {
        work_authorization_status:
          profile.resume.preferences.work_authorization_status,
        years_of_experience:
          profile.resume.preferences.years_of_experience?.toString() ?? "",
        preferred_locations: normalizeTagList(
          profile.resume.preferences.preferred_locations,
        ),
        work_mode: profile.resume.preferences.work_mode,
        salary_expectation: profile.resume.preferences.salary_expectation,
        availability: profile.resume.preferences.availability,
      },
    },
  };
}

export function onboardingValuesToProfilePayload(
  values: OnboardingResumeFormValues,
): UpsertCandidateProfilePayload {
  const skills = normalizeTagList(values.resume.skills);
  const preferredLocations = normalizeTagList(
    values.resume.preferences.preferred_locations,
  );
  const experience = values.resume.experience
    .map((entry) => ({
      ...entry,
      technologies_used: normalizeTagList(entry.technologies_used),
    }))
    .filter(isExperienceEntryFilled);
  const education = values.resume.education.filter(isEducationEntryFilled);
  const languages = values.resume.languages.filter(isLanguageEntryFilled);
  const summary =
    values.resume.summary.trim() ||
    buildResumeSummary({
      professionalTitle: values.resume.professional_title,
      yearsOfExperience: values.resume.preferences.years_of_experience,
      skills,
      preferredLocations,
      workAuthorizationStatus: values.resume.preferences.work_authorization_status,
    });
  const cvText =
    values.resume_reference_text.trim() ||
    buildResumeText({
      fullName: joinFullName(values.user.first_name, values.user.last_name),
      location: formatLocation(values.user.address.city, values.user.address.country),
      professionalTitle: values.resume.professional_title,
      summary,
      skills,
      languages,
      experience,
      education,
    });

  return {
    full_name: joinFullName(values.user.first_name, values.user.last_name),
    email: values.user.email.trim(),
    phone: values.user.phone.trim(),
    location: formatLocation(values.user.address.city, values.user.address.country),
    target_role: values.resume.professional_title.trim(),
    years_of_experience: parseOptionalInteger(
      values.resume.preferences.years_of_experience,
    ),
    skills: skills.join(", "),
    languages: languages
      .map((entry) =>
        [entry.language.trim(), entry.level.trim()].filter(Boolean).join(" "),
      )
      .join(", "),
    work_authorization: values.resume.preferences.work_authorization_status.trim(),
    remote_preference: values.resume.preferences.work_mode.trim(),
    preferred_locations: preferredLocations.join(", "),
    salary_expectation: values.resume.preferences.salary_expectation.trim(),
    professional_summary: summary,
    cv_text: cvText,
    user: {
      first_name: values.user.first_name.trim(),
      last_name: values.user.last_name.trim(),
      birth_year: parseOptionalInteger(values.user.birth_year),
      email: values.user.email.trim(),
      phone: values.user.phone.trim(),
      address: {
        street: values.user.address.street.trim(),
        city: values.user.address.city.trim(),
        postal_code: values.user.address.postal_code.trim(),
        country: values.user.address.country.trim(),
      },
    },
    resume: {
      professional_title: values.resume.professional_title.trim(),
      summary,
      experience: experience.map((entry) => ({
        job_title: entry.job_title.trim(),
        company: entry.company.trim(),
        location: entry.location.trim(),
        start_date: entry.start_date.trim(),
        end_date: entry.end_date.trim(),
        responsibilities: entry.responsibilities.trim(),
        technologies_used: normalizeTagList(entry.technologies_used),
      })),
      education: education.map((entry) => ({
        institution: entry.institution.trim(),
        degree: entry.degree.trim(),
        field_of_study: entry.field_of_study.trim(),
        start_year: parseOptionalInteger(entry.start_year),
        end_year: parseOptionalInteger(entry.end_year),
      })),
      skills,
      languages: languages.map((entry) => ({
        language: entry.language.trim(),
        level: entry.level.trim(),
      })),
      preferences: {
        work_authorization_status:
          values.resume.preferences.work_authorization_status.trim(),
        years_of_experience: parseOptionalInteger(
          values.resume.preferences.years_of_experience,
        ),
        preferred_locations: preferredLocations,
        work_mode: values.resume.preferences.work_mode.trim(),
        salary_expectation: values.resume.preferences.salary_expectation.trim(),
        availability: values.resume.preferences.availability.trim(),
      },
    },
  };
}

export function getVisibleExperienceCount(values: OnboardingResumeFormValues) {
  return values.resume.experience.filter(isExperienceEntryFilled).length;
}

export function getVisibleEducationCount(values: OnboardingResumeFormValues) {
  return values.resume.education.filter(isEducationEntryFilled).length;
}

export function getVisibleLanguageCount(values: OnboardingResumeFormValues) {
  return values.resume.languages.filter(isLanguageEntryFilled).length;
}

function mapExperienceEntryToForm(entry: ResumeExperienceEntry) {
  return {
    job_title: entry.job_title,
    company: entry.company,
    location: entry.location,
    start_date: normalizeDateInputValue(entry.start_date),
    end_date: normalizeDateInputValue(entry.end_date),
    responsibilities: entry.responsibilities,
    technologies_used: normalizeTagList(entry.technologies_used),
  };
}

function mapEducationEntryToForm(entry: ResumeEducationEntry) {
  return {
    institution: entry.institution,
    degree: entry.degree,
    field_of_study: entry.field_of_study,
    start_year: entry.start_year?.toString() ?? "",
    end_year: entry.end_year?.toString() ?? "",
  };
}

function normalizeTagList(values: string[]) {
  return values.map((item) => item.trim()).filter(Boolean);
}

function normalizeDateInputValue(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const yearMonthMatch = normalized.match(/^(\d{4})-(\d{2})$/);
  if (yearMonthMatch) {
    return `${yearMonthMatch[1]}-${yearMonthMatch[2]}-01`;
  }

  const monthYearMatch = normalized.match(/^(\d{1,2})\/(\d{4})$/);
  if (monthYearMatch) {
    return `${monthYearMatch[2]}-${monthYearMatch[1].padStart(2, "0")}-01`;
  }

  const leadingMonthYearMatch = normalized.match(/^(\d{1,2})\/(\d{4})/);
  if (leadingMonthYearMatch) {
    return `${leadingMonthYearMatch[2]}-${leadingMonthYearMatch[1].padStart(2, "0")}-01`;
  }

  return "";
}

function parseOptionalInteger(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function buildResumeSummary({
  professionalTitle,
  yearsOfExperience,
  skills,
  preferredLocations,
  workAuthorizationStatus,
}: {
  professionalTitle: string;
  yearsOfExperience: string;
  skills: string[];
  preferredLocations: string[];
  workAuthorizationStatus: string;
}) {
  const fragments: string[] = [];
  const normalizedRole = professionalTitle.trim();
  const normalizedYears = yearsOfExperience.trim();

  if (normalizedRole && normalizedYears) {
    fragments.push(
      `${normalizedRole} with ${normalizedYears} years of professional experience.`,
    );
  } else if (normalizedRole) {
    fragments.push(`Candidate targeting ${normalizedRole} roles.`);
  }

  if (skills.length) {
    fragments.push(`Core skills include ${skills.slice(0, 4).join(", ")}.`);
  }

  if (preferredLocations.length) {
    fragments.push(
      `Focused on opportunities in ${preferredLocations.slice(0, 2).join(", ")}.`,
    );
  }

  if (workAuthorizationStatus.trim()) {
    fragments.push(`Work authorization: ${workAuthorizationStatus.trim()}.`);
  }

  return fragments.join(" ");
}

function buildResumeText({
  fullName,
  location,
  professionalTitle,
  summary,
  skills,
  languages,
  experience,
  education,
}: {
  fullName: string;
  location: string;
  professionalTitle: string;
  summary: string;
  skills: string[];
  languages: OnboardingResumeFormValues["resume"]["languages"];
  experience: OnboardingResumeFormValues["resume"]["experience"];
  education: OnboardingResumeFormValues["resume"]["education"];
}) {
  const lines: string[] = [];

  if (fullName) {
    lines.push(fullName);
  }

  if (professionalTitle.trim()) {
    lines.push(professionalTitle.trim());
  }

  if (location) {
    lines.push(location);
  }

  if (summary.trim()) {
    lines.push("");
    lines.push("Summary");
    lines.push(summary.trim());
  }

  if (skills.length) {
    lines.push("");
    lines.push(`Skills: ${skills.join(", ")}`);
  }

  const formattedLanguages = languages
    .filter(isLanguageEntryFilled)
    .map((entry) =>
      [entry.language.trim(), entry.level.trim()].filter(Boolean).join(" "),
    );
  if (formattedLanguages.length) {
    lines.push("");
    lines.push(`Languages: ${formattedLanguages.join(", ")}`);
  }

  const filledExperience = experience.filter(isExperienceEntryFilled);
  if (filledExperience.length) {
    lines.push("");
    lines.push("Experience");
    for (const entry of filledExperience) {
      lines.push(
        [entry.job_title.trim(), entry.company.trim()]
          .filter(Boolean)
          .join(" | "),
      );
      const dateRange = [entry.start_date.trim(), entry.end_date.trim()]
        .filter(Boolean)
        .join(" - ");
      if (dateRange) {
        lines.push(dateRange);
      }
      if (entry.location.trim()) {
        lines.push(entry.location.trim());
      }
      if (entry.responsibilities.trim()) {
        lines.push(entry.responsibilities.trim());
      }
      if (entry.technologies_used.length) {
        lines.push(`Technologies: ${entry.technologies_used.join(", ")}`);
      }
      lines.push("");
    }
  }

  const filledEducation = education.filter(isEducationEntryFilled);
  if (filledEducation.length) {
    lines.push("Education");
    for (const entry of filledEducation) {
      lines.push(
        [entry.degree.trim(), entry.field_of_study.trim(), entry.institution.trim()]
          .filter(Boolean)
          .join(" | "),
      );
      const years = [entry.start_year.trim(), entry.end_year.trim()]
        .filter(Boolean)
        .join(" - ");
      if (years) {
        lines.push(years);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trim() || "Resume profile not provided yet.";
}

function joinFullName(firstName: string, lastName: string) {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}

function formatLocation(city: string, country: string) {
  return [city.trim(), country.trim()].filter(Boolean).join(", ");
}

function isExperienceEntryFilled(
  entry: OnboardingResumeFormValues["resume"]["experience"][number],
) {
  return Boolean(
    entry.job_title.trim() ||
      entry.company.trim() ||
      entry.location.trim() ||
      entry.start_date.trim() ||
      entry.end_date.trim() ||
      entry.responsibilities.trim() ||
      entry.technologies_used.length,
  );
}

function isEducationEntryFilled(
  entry: OnboardingResumeFormValues["resume"]["education"][number],
) {
  return Boolean(
    entry.institution.trim() ||
      entry.degree.trim() ||
      entry.field_of_study.trim() ||
      entry.start_year.trim() ||
      entry.end_year.trim(),
  );
}

function isLanguageEntryFilled(
  entry: OnboardingResumeFormValues["resume"]["languages"][number],
) {
  return Boolean(entry.language.trim() || entry.level.trim());
}
