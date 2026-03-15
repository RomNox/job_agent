import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams?: {
    next?: string | string[];
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return <LoginForm nextPath={readFirstQueryValue(searchParams?.next)} />;
}

function readFirstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
