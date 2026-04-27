import type { Metadata } from "next";

import { AuthPanel } from "@/components/public/auth-panel";

export const metadata: Metadata = {
  title: "Acceso | Builder HeredIA",
  description:
    "Entra al LMS oficial de Rodrigo HeredIA y continúa dentro de tu entorno privado.",
};

export default function LoginPage() {
  return <AuthPanel mode="login" />;
}
