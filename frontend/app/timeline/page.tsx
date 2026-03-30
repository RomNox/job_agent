import { AuthGuard } from "@/components/auth/auth-guard";
import { SetupFlowScreen } from "@/components/setup/setup-flow-screen";
import { buildSetupFlowPath } from "@/lib/onboarding";

type TimelinePageProps = {
  searchParams?: {
    next?: string | string[];
    step?: string | string[];
  };
};

export default function TimelinePage({ searchParams }: TimelinePageProps) {
  const nextValue = readFirstQueryValue(searchParams?.next);
  const step = parseStep(readFirstQueryValue(searchParams?.step));
  const nextPath = buildSetupFlowPath(nextValue, step);

  return (
    <AuthGuard nextPath={nextPath}>
      <SetupFlowScreen initialStep={step} nextPath={nextValue} />
    </AuthGuard>
  );
}

function readFirstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parseStep(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}
