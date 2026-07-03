import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";

import { ATTRIBUTION_COOKIE, computeAttributionUpdate } from "@/lib/attribution";
import { prisma } from "@/lib/db/prisma";
import { TRUSTED_EXTERNAL_ORIGINS } from "@/lib/external/config";
import { enrollUserInOnboarding } from "@/lib/services/email-sequence";

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
  events: {
    // Intento BEST-EFFORT de atribución al crear el usuario. Dentro de este
    // evento el acceso a cookies() de next/headers no es 100% confiable (puede
    // no tener el contexto de request tras el round-trip de OAuth), por eso NO
    // es la fuente de verdad: el respaldo confiable es el Server Action
    // persistAttribution() que corre desde /app tras el login. Si esto falla,
    // aquel lo captura. Import dinámico de next/headers para no arrastrarlo al
    // bundle del middleware.
    async createUser({ user }) {
      if (!user.id) {
        return;
      }

      // Inscripción al drip de onboarding: solo necesita el objeto User (no
      // cookies), así que aquí SÍ es confiable. En su propio try/catch para
      // que no bloquee el registro ni la atribución.
      try {
        await enrollUserInOnboarding(user.id, user.email);
      } catch (error) {
        console.error("[auth] No se pudo inscribir en el onboarding:", error);
      }

      try {
        const { cookies } = await import("next/headers");
        const store = await cookies();
        // Usuario recién creado → sin fuente previa (currentUtmSource = null).
        const data = computeAttributionUpdate(
          null,
          store.get(ATTRIBUTION_COOKIE)?.value,
        );

        if (data) {
          await prisma.user.update({ where: { id: user.id }, data });
        }
      } catch (error) {
        console.error("[auth] Atribución best-effort en createUser falló:", error);
      }
    },
  },
});
