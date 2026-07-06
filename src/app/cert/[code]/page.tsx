import type { Metadata } from "next";
import Link from "next/link";

import { getCertificateByCode } from "@/lib/services/certificates";

type CertPageProps = {
  params: Promise<{ code: string }>;
};

const certDateFormatter = new Intl.DateTimeFormat("es-EC", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Guayaquil",
});

export async function generateMetadata({
  params,
}: CertPageProps): Promise<Metadata> {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);

  if (!certificate || certificate.revokedAt) {
    return { title: "Certificado | Builder HeredIA", robots: { index: false } };
  }

  const programTitle =
    certificate.program?.title ?? "un programa de Builder HeredIA";
  const title = `${certificate.recipientName} completó ${programTitle}`;
  return {
    title: `${title} | Builder HeredIA`,
    description:
      "Certificado de finalización verificado, emitido por Builder HeredIA — el LMS oficial de Rodrigo HeredIA.",
    openGraph: {
      title,
      description: "Certificado verificado · Builder HeredIA",
    },
  };
}

export default async function CertificatePage({ params }: CertPageProps) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);
  const isValid = Boolean(certificate) && !certificate?.revokedAt;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/20 blur-[110px]" />

      <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-5 py-12">
        {isValid && certificate ? (
          <div className="w-full rounded-3xl border border-teal-400/30 bg-neutral-900/80 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Builder HeredIA · Certificado de finalización
            </p>

            <p className="mt-8 text-sm text-neutral-400">Se certifica que</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {certificate.recipientName}
            </h1>
            <p className="mt-6 text-sm text-neutral-400">completó el programa</p>
            <p className="mt-2 text-2xl font-semibold text-teal-200">
              {certificate.program?.title ?? "Programa de Builder HeredIA"}
            </p>

            <div className="mx-auto mt-8 h-px w-24 bg-teal-400/40" />

            <p className="mt-6 text-sm leading-6 text-neutral-400">
              Emitido el {certDateFormatter.format(certificate.issuedAt)} por{" "}
              <span className="font-semibold text-neutral-200">
                Builder HeredIA
              </span>
              , el LMS oficial de Rodrigo HeredIA.
            </p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-200">
              ✓ Verificado · código {certificate.code}
            </p>

            <div className="mt-10">
              <Link
                href="/?utm_source=certificado&utm_medium=cert&utm_campaign=share"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal-300 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-teal-200"
              >
                Aprende a construir con IA →
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/80 p-10 text-center">
            <h1 className="text-2xl font-semibold text-white">
              Este certificado no es válido
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              El código no existe o el certificado fue revocado. Si crees que
              es un error, escribe a soporte@rodriheredia.com.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-neutral-500"
            >
              Ir a Builder HeredIA
            </Link>
          </div>
        )}

        <p className="mt-8 text-[0.7rem] text-neutral-600">
          builder.rodriheredia.com/cert · verificación pública
        </p>
      </div>
    </main>
  );
}
