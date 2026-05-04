import Link from "next/link";

import { ProgramForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { createProgram } from "@/lib/actions/admin-content";
import { listAdminProducts } from "@/lib/services";

export default async function NewProgramPage() {
  const products = await listAdminProducts();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Nuevo programa"
        description="Crea una ruta de aprendizaje y define si empieza como borrador, preventa o programa abierto."
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
          action={createProgram}
          products={products}
          submitLabel="Crear programa"
        />
      </Card>
    </div>
  );
}
