import { GetServerSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await GetServerSession();
  if (!session) {
    redirect("/auth/sign-in");
  }
  return (
    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}
