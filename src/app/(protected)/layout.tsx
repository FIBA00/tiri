import { GetServerSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await GetServerSession();

  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    <main className="flex-1 p-4 sm:p-6">
      {children}
    </main>
  )
}
