import { PlaceholderPage } from "@/components/shared/placeholder-page";

type ModulePageProps = {
  params: Promise<{ programSlug: string; moduleSlug: string }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { programSlug, moduleSlug } = await params;

  return (
    <PlaceholderPage
      eyebrow="Modulo"
      title={`Modulo: ${moduleSlug}`}
      description={`Vista base dentro del programa ${programSlug}.`}
    />
  );
}
