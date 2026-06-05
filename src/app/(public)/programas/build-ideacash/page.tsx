import { redirect } from "next/navigation";

// Página de ventas legacy (pre-lanzamiento de "Build IdeaCash"). Ya no se
// enlaza desde ningún lado y su contenido quedó obsoleto tras el lanzamiento.
// Redirige a la home para no romper enlaces antiguos.
export default function BuildIdeacashLegacyPage() {
  redirect("/");
}
