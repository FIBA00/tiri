import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CheckInTerminal } from "@/features/check-in/components/check-in-terminal";

// Local helper to merge your custom role property with the default user model
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
  const reqHeaders = await headers(); // camelCase variable

  // 1. Authenticate the User
  const rawSession = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!rawSession?.user) {
    redirect("/sign-in");
  }

  // Safely cast the user object to the extended helper type
  const sessionUser = rawSession.user as SessionUserWithRole;

  // 2. Validate Event Existence and Ownership
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

  // 3. Authorize the User
  // We use our clean, casted sessionUser object here
  const isOwner = eventDetails.userId === sessionUser.id;
  const isAdmin = sessionUser.role?.includes("admin");

  if (!isOwner && !isAdmin) {
    redirect("/unauthorized");
  }

  // 4. Render the Terminal
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center">

      {/* Event Header for the Door Staff */}
      <div className="max-w-md w-full mb-8 text-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Door Check-in Active for
        </h1>
        <p className="text-2xl font-black text-gray-900 mt-1">
          {eventDetails.name}
        </p>
      </div>

      {/* The Secure Terminal Component */}
      <div className="w-full">
        <CheckInTerminal eventId={eventDetails.id} />
      </div>

    </div>
  );
}
