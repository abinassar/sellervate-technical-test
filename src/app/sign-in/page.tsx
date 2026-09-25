import { getAllUsersWithRoles } from "@/lib/db/repositories/users.repository";
import { SignInCard } from "./sign-in-card";
import { User } from "@/lib/types/user";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  let users: User[] = [];

  try {
    users = await getAllUsersWithRoles();
  } catch {
    users = [];
  }

  return (
    <main className="min-h-screen bg-base-200 text-base-content flex flex-col items-center justify-center p-4 sm:p-8">
      <SignInCard users={users} />
    </main>
  );
}
