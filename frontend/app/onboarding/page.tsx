import { AuthGuard } from "@/components/auth/auth-guard";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

type OnboardingPageProps = {
  searchParams?: {
    next?: string | string[];
  };
};

export default function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const nextValue = readFirstQueryValue(searchParams?.next);
  const nextPath = nextValue
    ? `/onboarding?next=${encodeURIComponent(nextValue)}`
    : "/onboarding";

  return (
    <AuthGuard nextPath={nextPath}>
      <OnboardingShell nextPath={nextValue} />
    </AuthGuard>
  );
}

function readFirstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
