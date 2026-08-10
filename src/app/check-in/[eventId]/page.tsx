import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ScanLine } from "lucide-react";
import { CheckInTerminalContainer } from "./terminal-container";

type SessionUserWithRole = {
  id: string;
  email: string;
  name: string;
  role: string[];
};

export default async function PublicCheckInPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const reqHeaders = await headers();

  const rawSession = await auth.api.getSession({
    headers: reqHeaders,
  });
  const sessionUser = rawSession?.user as SessionUserWithRole | undefined;

  const eventDetails = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      userId: true,
      name: true,
      checkInPin: true,
    },
  });

  if (!eventDetails) {
    notFound();
  }

  const isOwner = sessionUser?.id === eventDetails.userId;
  const isAdmin = sessionUser?.role?.includes("admin");
  const requiresPin = !!eventDetails.checkInPin && !isOwner && !isAdmin;

  return (
    <div className="min-h-screen bg-[#f5f4f8] dark:bg-[#1a1625] flex flex-col items-center py-12 px-4 animate-fade-in">
      <div className="glass mb-8 w-full max-w-md rounded-2xl p-6 text-center shadow-lg border border-hairline bg-paper">
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
        <CheckInTerminalContainer eventId={eventDetails.id} requiresPin={requiresPin} />
      </div>
    </div>
  );
}
