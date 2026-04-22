import Link from "next/link";
import { notFound } from "next/navigation";

import { ProgramForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { updateProgram } from "@/lib/actions/admin-content";
import { getAdminProgram, listAdminProducts } from "@/lib/services";

type EditProgramPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params;
  const [program, products] = await Promise.all([
    getAdminProgram(id),
    listAdminProducts(),
  ]);

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Editar programa"
        description={program.title}
        action={
          <Link
            href="/admin/programas"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Volver
          </Link>
        }
      />
      <Card>
        <ProgramForm
          action={updateProgram.bind(null, program.id)}
          products={products}
          program={program}
          submitLabel="Guardar cambios"
        />
      </Card>
    </div>
  );
}
