import { redirect } from "next/navigation";

import { LandingPage } from "@/components/landing/landing-page";

type LandingEntryPageProps = {
  searchParams?: {
    job_url?: string | string[];
    raw_job_text?: string | string[];
    resolved_job_key?: string | string[];
  };
};

export default function LandingEntryPage({
  searchParams,
}: LandingEntryPageProps) {
  const jobUrl = readFirstQueryValue(searchParams?.job_url);
  const rawJobText = readFirstQueryValue(searchParams?.raw_job_text);
  const resolvedJobKey = readFirstQueryValue(searchParams?.resolved_job_key);

  if (jobUrl || rawJobText || resolvedJobKey) {
    const workspaceParams = new URLSearchParams();
    if (jobUrl) {
      workspaceParams.set("job_url", jobUrl);
    }
    if (rawJobText) {
      workspaceParams.set("raw_job_text", rawJobText);
    }
    if (resolvedJobKey) {
      workspaceParams.set("resolved_job_key", resolvedJobKey);
    }
    redirect(`/workspace?${workspaceParams.toString()}`);
  }

  return <LandingPage />;
}

function readFirstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
