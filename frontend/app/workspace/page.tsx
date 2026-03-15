import { AuthGuard } from "@/components/auth/auth-guard";
import { ApplicationWorkspace } from "@/components/application-workspace";

type WorkspacePageProps = {
  searchParams?: {
    job_url?: string | string[];
    raw_job_text?: string | string[];
    resolved_job_key?: string | string[];
  };
};

export default function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const nextPath = buildWorkspaceNextPath(searchParams);

  return (
    <AuthGuard requireCompletedOnboarding nextPath={nextPath}>
      <ApplicationWorkspace
        initialJobUrl={readFirstQueryValue(searchParams?.job_url)}
        initialRawJobText={readFirstQueryValue(searchParams?.raw_job_text)}
        initialResolvedJobKey={readFirstQueryValue(searchParams?.resolved_job_key)}
      />
    </AuthGuard>
  );
}

function readFirstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function buildWorkspaceNextPath(searchParams: WorkspacePageProps["searchParams"]) {
  const params = new URLSearchParams();

  const jobUrl = readFirstQueryValue(searchParams?.job_url);
  const rawJobText = readFirstQueryValue(searchParams?.raw_job_text);
  const resolvedJobKey = readFirstQueryValue(searchParams?.resolved_job_key);

  if (jobUrl) {
    params.set("job_url", jobUrl);
  }
  if (rawJobText) {
    params.set("raw_job_text", rawJobText);
  }
  if (resolvedJobKey) {
    params.set("resolved_job_key", resolvedJobKey);
  }

  const queryString = params.toString();
  return queryString ? `/workspace?${queryString}` : "/workspace";
}
