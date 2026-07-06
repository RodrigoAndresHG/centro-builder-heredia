import Link from "next/link";
import { redirect } from "next/navigation";

import { CertificateShare } from "@/components/app/certificate-share";
import { NextStepUpsell } from "@/components/app/next-step-upsell";
import { confirmCertificateName } from "@/lib/actions/certificates";
import { auth } from "@/lib/auth";
import { getAppBaseUrl } from "@/lib/email/config";
import { getOrIssueCertificate } from "@/lib/services/certificates";

type CompletadoPageProps = {
  params: Promise<{ programSlug: string }>;
};

const certDateFormatter = new Intl.DateTimeFormat("es-EC", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Guayaquil",
});

export default async function ProgramaCompletadoPage({
  params,
}: CompletadoPageProps) {
  const { programSlug } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(`/login?callbackUrl=/app/programas/${programSlug}/completado`);
  }

  const result = await getOrIssueCertificate(
    { id: user.id, role: user.role },
    programSlug,
  );

  if (result.status === "not-found" || result.status === "locked") {
    redirect("/app/programas");
  }

  if (result.status === "incomplete") {
    // Aún no está al 100% — de vuelta al mapa del programa.
    redirect(`/app/programas/${programSlug}`);
  }

  if (result.status === "needs-name") {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-6">
        <div className="rounded-2xl border border-teal-400/25 bg-teal-400/10 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
            Programa completado
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">
            ¡Lo lograste! 🎉
          </h1>
          <p className="mt-3 text-sm leading-7 text-neutral-300">
            Tu certificado está listo para emitirse. Como es un documento
            público y verificable, confirma el nombre completo que quieres que
            aparezca en él.
          </p>
        </div>

        <form
          action={confirmCertificateName.bind(null, programSlug)}
          className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-white">
              Tu nombre completo
            </span>
            <input
              required
              name="name"
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="Ej. Rodrigo Heredia"
              className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-300"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-teal-300 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-teal-200"
          >
            Emitir mi certificado
          </button>
        </form>
      </div>
    );
  }

  const { certificate } = result;
  const certUrl = `${getAppBaseUrl()}/cert/${certificate.code}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="rounded-2xl border border-teal-400/25 bg-teal-400/10 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
          Programa completado
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-white">
          ¡Felicidades, {certificate.recipientName}! 🎉
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-300">
          Completaste <span className="font-semibold text-white">{certificate.programTitle}</span>.
          Tu certificado quedó emitido el {certDateFormatter.format(certificate.issuedAt)} y
          cualquiera puede verificarlo con tu link público.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Tu certificado verificable
            </p>
            <Link
              href={`/cert/${certificate.code}`}
              className="mt-1 block truncate text-sm font-semibold text-teal-300 underline decoration-teal-300/40 underline-offset-4 hover:text-teal-200"
            >
              {certUrl}
            </Link>
          </div>
          <Link
            href={`/cert/${certificate.code}`}
            className="shrink-0 rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-center text-sm font-semibold text-white transition hover:border-neutral-500"
          >
            Ver certificado
          </Link>
        </div>
        <div className="mt-5 border-t border-neutral-800 pt-5">
          <CertificateShare
            programTitle={certificate.programTitle}
            certUrl={certUrl}
            certCode={certificate.code}
            issuedAtIso={certificate.issuedAt.toISOString()}
          />
        </div>
      </div>

      <NextStepUpsell
        viewer={{ id: user.id, role: user.role }}
        eyebrow="¿Y ahora? Tu siguiente peldaño"
      />

      <div className="text-center">
        <Link
          href="/app"
          className="text-sm font-semibold text-neutral-400 underline decoration-neutral-700 underline-offset-4 transition hover:text-neutral-200"
        >
          Volver a mi workspace
        </Link>
      </div>
    </div>
  );
}
