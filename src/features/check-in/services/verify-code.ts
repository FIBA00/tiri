import { prisma } from "@/lib/prisma";

// PascalCase function
export async function VerifyCode(code: string, eventId: string) {
  const inviteData = await prisma.invitation.findFirst({
    where: {
      code: {
        equals: code,
        mode: "insensitive",
      },
      eventId,
    },
  });

  if (!inviteData) {
    throw new Error("Invalid code. No invitation found.");
  }

  return inviteData;
}
