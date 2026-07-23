import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { createAuthMiddleware } from "better-auth/api";
import { generateId } from "./id.ts";

interface SessionResponse {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    role: string[];
  };
  session: any;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          let defaultRole = await prisma.role.findFirst({
            where: { guardName: "user" },
          });

          if (!defaultRole) {
            defaultRole = await prisma.role.create({
              data: {
                id: generateId(),
                name: "User",
                guardName: "user",
              },
            });
          }

          await prisma.userRole.create({
            data: {
              id: generateId(),
              userId: user.id,
              roleId: defaultRole.id,
            },
          });
        },
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (context) => {
      if (context.path === "/get-session") {
        const responseData = context.context.returned as SessionResponse | null;

        if (responseData && "user" in responseData && responseData.user) {
          const userId = responseData.user.id;

          const userRole = await prisma.userRole.findMany({
            where: {
              userId,
            },
            include: {
              role: true,
            },
          });

          const roles = userRole.map((r) => r.role.guardName);

          responseData.user.role = roles;
        }
      }
    }),
  },
});
