import type { Metadata } from "next";

import { AuthPanel } from "@/components/public/auth-panel";

export const metadata: Metadata = {
  title: "Registro | Builder HeredIA",
  description:
    "Crea tu acceso al LMS oficial de Rodrigo HeredIA y prepárate para el lanzamiento del primer programa.",
};

export default function RegistroPage() {
  return <AuthPanel mode="registro" />;
}
