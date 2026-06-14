import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";

import { prisma } from "@/lib/db/prisma";
import { TRUSTED_EXTERNAL_ORIGINS } from "@/lib/external/config";

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
    // Réplica del comportamiento por defecto de Auth.js (relativas y mismo
    // origen permitidas; cualquier otra cosa cae al LMS) + allowlist de
    // apps externas de confianza, para que el magic link disparado desde
    // /api/external/registro pueda volver a PronostiGol.
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const target = new URL(url);

        if (target.origin === new URL(baseUrl).origin) {
          return url;
        }

        if (TRUSTED_EXTERNAL_ORIGINS.has(target.origin)) {
          return url;
        }
      } catch {
        // url inválida → destino seguro por defecto
      }

      return baseUrl;
    },
  },
});
