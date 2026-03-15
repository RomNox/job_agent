import { SignupForm } from "@/components/auth/signup-form";

type SignupPageProps = {
  searchParams?: {
    next?: string | string[];
  };
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  return <SignupForm nextPath={readFirstQueryValue(searchParams?.next)} />;
}

function readFirstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
