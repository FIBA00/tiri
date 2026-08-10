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
    <div className="min-h-screen bg-paper flex flex-col items-center p-4 sm:p-8 animate-fade-in relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-seal/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-8 mt-6 md:mt-12 relative z-10">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-20 w-20 rounded-full bg-paper-raised shadow-lg border border-hairline flex items-center justify-center mb-2">
            <div className="h-14 w-14 rounded-full bg-seal/10 flex items-center justify-center text-seal">
              <ScanLine className="h-7 w-7" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="eyebrow text-seal">Door Check-in Active</p>
            <h1 className="font-display text-3xl font-black text-ink tracking-tight">
              {eventDetails.name}
            </h1>
          </div>
        </div>

        <div className="w-full">
          <CheckInTerminalContainer eventId={eventDetails.id} requiresPin={requiresPin} />
        </div>
      </div>
    </div>
  );
}
