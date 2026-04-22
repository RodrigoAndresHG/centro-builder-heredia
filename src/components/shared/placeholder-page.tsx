import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  details?: string[];
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  details = ["Estructura lista", "Contenido pendiente", "Logica futura"],
}: PlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <SectionBlock title="Estado de esta pantalla">
        <div className="grid gap-4 md:grid-cols-3">
          {details.map((detail) => (
            <Card key={detail}>
              <p className="text-sm font-medium text-neutral-700">{detail}</p>
            </Card>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
