import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CheckInTerminal } from "@/features/check-in/components/check-in-terminal";
import { ScanLine } from "lucide-react";

type SessionUserWithRole = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: string[];
};

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const reqHeaders = await headers();

  const rawSession = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!rawSession?.user) {
    redirect("/sign-in");
  }

  const sessionUser = rawSession.user as SessionUserWithRole;

  const eventDetails = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      userId: true,
      name: true,
    },
  });

  if (!eventDetails) {
    notFound();
  }

  const isOwner = eventDetails.userId === sessionUser.id;
  const isAdmin = sessionUser.role?.includes("admin");

  if (!isOwner && !isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="glass mb-8 w-full max-w-md rounded-2xl p-6 text-center shadow-lg border border-hairline">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-seal/10 text-seal">
            <ScanLine className="h-6 w-6" />
          </div>
        </div>
        <h1 className="eyebrow mb-2">Door Check-in Active for</h1>
        <p className="font-display text-2xl font-black text-ink">
          {eventDetails.name}
        </p>
      </div>

      <div className="w-full max-w-md">
        <CheckInTerminal eventId={eventDetails.id} />
      </div>
    </div>
  );
}
