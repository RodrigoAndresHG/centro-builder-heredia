import { PlaceholderPage } from "@/components/shared/placeholder-page";

type LessonPageProps = {
  params: Promise<{ programSlug: string; lessonSlug: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { programSlug, lessonSlug } = await params;

  return (
    <PlaceholderPage
      eyebrow="Leccion"
      title={`Leccion: ${lessonSlug}`}
      description={`Reproductor y contenido pendientes para el programa ${programSlug}.`}
    />
  );
}
