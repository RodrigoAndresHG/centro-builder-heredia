"use client";

import { useState } from "react";

import { buildLinkedInAddUrl, buildWhatsappShareUrl } from "@/lib/cert-links";

type CertificateShareProps = {
  programTitle: string;
  certUrl: string;
  certCode: string;
  issuedAtIso: string;
};

// Botones de compartir del certificado: LinkedIn (añadir a perfil), WhatsApp
// y copiar link. issuedAt viaja como ISO string (frontera server→client).
export function CertificateShare({
  programTitle,
  certUrl,
  certCode,
  issuedAtIso,
}: CertificateShareProps) {
  const [copied, setCopied] = useState(false);

  const linkedInHref = buildLinkedInAddUrl({
    programTitle,
    certUrl,
    certCode,
    issuedAt: new Date(issuedAtIso),
  });
  const whatsappHref = buildWhatsappShareUrl({ programTitle, certUrl });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(certUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // El botón simplemente no confirma; el usuario puede copiar de la URL.
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <a
        href={linkedInHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b5cad]"
      >
        Añadir a LinkedIn
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
      >
        Compartir por WhatsApp
      </a>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
      >
        {copied ? "✓ Copiado" : "Copiar link"}
      </button>
    </div>
  );
}
