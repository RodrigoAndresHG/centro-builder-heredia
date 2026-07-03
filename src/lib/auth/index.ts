import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { cookies } from "next/headers";

import { prisma } from "@/lib/db/prisma";
import {
  ATTRIBUTION_COOKIE,
  parseAttributionCookie,
} from "@/lib/attribution/cookie";

const emailProvider =
  process.env.EMAIL_SERVER && process.env.EMAIL_FROM
    ? [
        Nodemailer({
          server: process.env.EMAIL_SERVER,
          from: process.env.EMAIL_FROM,
        }),
      ]
    : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/acceso-confirmado",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    ...emailProvider,
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.roleKey ?? "INVITADO";
      }

      return session;
    },
  },
  events: {
    // Al crear la cuenta, estampa la atribución (cookie que dejó /registro) en
    // el User. Nunca bloquea el signup: si algo falla, se ignora.
    async createUser({ user }) {
      try {
        const jar = await cookies();
        const attr = parseAttributionCookie(jar.get(ATTRIBUTION_COOKIE)?.value);
        if (!attr?.source) return;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            source: attr.source,
            utmMedium: attr.medium ?? null,
            utmCampaign: attr.campaign ?? null,
            utmContent: attr.content ?? null,
            landingIntent: attr.intent ?? null,
          },
        });
      } catch {
        // Atribución best-effort: no romper el registro.
      }
    },
  },
});
