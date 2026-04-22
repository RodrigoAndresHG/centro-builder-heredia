import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default function AccesoConfirmadoPage() {
  return (
    <PlaceholderPage
      eyebrow="Acceso"
      title="Acceso confirmado"
      description="Revisa tu correo y abre el enlace seguro para completar el acceso."
      details={["Magic link enviado", "Expira automaticamente", "Sesion segura"]}
    />
  );
}
