// Helpers puros para compartir certificados. Sin dependencias (cliente y servidor).

// Deep link oficial de LinkedIn "Añadir a mi perfil" (sección Licencias y
// certificaciones), precargado. No requiere API ni app registrada.
export function buildLinkedInAddUrl(params: {
  programTitle: string;
  certUrl: string;
  certCode: string;
  issuedAt: Date;
}): string {
  const query = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: params.programTitle,
    organizationName: "Builder HeredIA",
    issueYear: String(params.issuedAt.getUTCFullYear()),
    issueMonth: String(params.issuedAt.getUTCMonth() + 1),
    certUrl: params.certUrl,
    certId: params.certCode,
  });

  return `https://www.linkedin.com/profile/add?${query.toString()}`;
}

export function buildWhatsappShareUrl(params: {
  programTitle: string;
  certUrl: string;
}): string {
  const text = `Completé "${params.programTitle}" en Builder HeredIA 🎓 Mi certificado: ${params.certUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
