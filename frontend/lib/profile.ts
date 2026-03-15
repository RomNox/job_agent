import type {
  CandidateProfileFormValues,
  CandidateProfilePayload,
  CandidateProfileResponse,
  UpsertCandidateProfilePayload,
  WorkspaceFormValues,
} from "@/types/api";
import type { Locale } from "@/lib/locale";

export const PROFILE_FIELD_NAMES = [
  "full_name",
  "email",
  "phone",
  "location",
  "target_role",
  "years_of_experience",
  "skills",
  "languages",
  "work_authorization",
  "remote_preference",
  "preferred_locations",
  "salary_expectation",
  "professional_summary",
  "cv_text",
] as const satisfies readonly (keyof CandidateProfileFormValues | keyof WorkspaceFormValues)[];

export function candidateProfileToWorkspaceValues(
  profile: CandidateProfileResponse,
): CandidateProfileFormValues {
  return {
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    target_role: profile.target_role,
    years_of_experience: profile.years_of_experience?.toString() ?? "",
    skills: profile.skills,
    languages: profile.languages,
    work_authorization: profile.work_authorization,
    remote_preference: profile.remote_preference,
    preferred_locations: profile.preferred_locations,
    salary_expectation: profile.salary_expectation,
    professional_summary: profile.professional_summary,
    cv_text: profile.cv_text,
  };
}

export function workspaceValuesToProfilePayload(
  values: CandidateProfileFormValues,
): UpsertCandidateProfilePayload {
  return {
    full_name: values.full_name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    location: values.location.trim(),
    target_role: values.target_role.trim(),
    years_of_experience: parseOptionalInteger(values.years_of_experience),
    skills: values.skills.trim(),
    languages: values.languages.trim(),
    work_authorization: values.work_authorization.trim(),
    remote_preference: values.remote_preference.trim(),
    preferred_locations: values.preferred_locations.trim(),
    salary_expectation: values.salary_expectation.trim(),
    professional_summary: values.professional_summary.trim(),
    cv_text: values.cv_text.trim(),
  };
}

export function workspaceValuesToCandidateProfilePayload(
  values: CandidateProfileFormValues,
): CandidateProfilePayload {
  const payload: CandidateProfilePayload = {
    full_name: values.full_name.trim(),
  };

  const email = values.email.trim();
  const phone = values.phone.trim();
  const professionalSummary = values.professional_summary.trim();
  const skills = splitCsv(values.skills);
  const languages = splitCsv(values.languages);
  const targetRole = values.target_role.trim();
  const preferredLocations = splitCsv(values.preferred_locations);
  const currentLocation = values.location.trim();
  const yearsOfExperience = parseOptionalInteger(values.years_of_experience);

  if (email) {
    payload.email = email;
  }
  if (phone) {
    payload.phone = phone;
  }
  if (professionalSummary) {
    payload.summary = professionalSummary;
  }
  if (skills.length) {
    payload.skills = skills;
  }
  if (languages.length) {
    payload.languages = languages;
  }
  if (targetRole) {
    payload.desired_roles = [targetRole];
  }
  if (preferredLocations.length) {
    payload.desired_locations = preferredLocations;
  } else if (currentLocation) {
    payload.desired_locations = [currentLocation];
  }
  if (yearsOfExperience !== null) {
    payload.experience_years = yearsOfExperience;
  }

  return payload;
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalInteger(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function formatProfileTimestamp(value: string, locale: Locale) {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toLocaleString(toIntlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getLoadedProfileMessage(profile: CandidateProfileResponse) {
  if (!profile.updated_at) {
    return "Es gibt noch kein gespeichertes Profil.";
  }

  return `Gespeichertes Profil geladen. Zuletzt aktualisiert: ${
    formatProfileTimestamp(profile.updated_at, "de") ?? "vor Kurzem"
  }.`;
}

export function getSavedProfileMessage(profile: CandidateProfileResponse) {
  if (!profile.updated_at) {
    return "Profil gespeichert.";
  }

  return `Profil gespeichert um ${
    formatProfileTimestamp(profile.updated_at, "de") ?? "vor Kurzem"
  }.`;
}

function toIntlLocale(locale: Locale) {
  switch (locale) {
    case "de":
      return "de-DE";
    case "en":
      return "en-US";
    case "ru":
      return "ru-RU";
    case "uk":
      return "uk-UA";
    default:
      return "de-DE";
  }
}
