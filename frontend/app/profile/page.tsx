import { AuthGuard } from "@/components/auth/auth-guard";
import { ProfileEditor } from "@/components/profile/profile-editor";

export default function ProfilePage() {
  return (
    <AuthGuard nextPath="/profile">
      <ProfileEditor />
    </AuthGuard>
  );
}
