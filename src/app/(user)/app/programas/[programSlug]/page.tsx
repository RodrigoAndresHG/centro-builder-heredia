import { PlaceholderPage } from "@/components/shared/placeholder-page";

type ProgramPageProps = {
  params: Promise<{ programSlug: string }>;
};

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { programSlug } = await params;

  return (
    <PlaceholderPage
      eyebrow="Programa"
      title={`Programa: ${programSlug}`}
      description="Detalle base de programa. Modulos y progreso se conectaran en fases futuras."
    />
  );
}
