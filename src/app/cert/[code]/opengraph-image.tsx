import { ImageResponse } from "next/og";

import { getCertificateByCode } from "@/lib/services/certificates";

// Imagen OG del certificado (para el preview al compartir en LinkedIn,
// WhatsApp, etc.). Estilo de la marca: fondo oscuro + acento teal.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Certificado de finalización · Builder HeredIA";

export default async function OgImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);
  const valid = Boolean(certificate) && !certificate?.revokedAt;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "88%",
            height: "82%",
            border: "3px solid #2dd4bf",
            borderRadius: 32,
            backgroundColor: "#111111",
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#5eead4",
              fontWeight: 700,
            }}
          >
            Builder HeredIA
          </div>
          <div style={{ fontSize: 22, color: "#a3a3a3", marginTop: 28 }}>
            Certificado de finalización
          </div>

          {valid && certificate ? (
            <>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  marginTop: 24,
                  textAlign: "center",
                }}
              >
                {certificate.recipientName}
              </div>
              <div
                style={{
                  fontSize: 34,
                  color: "#5eead4",
                  marginTop: 20,
                  textAlign: "center",
                }}
              >
                {certificate.program?.title ?? "Programa de Builder HeredIA"}
              </div>
              <div style={{ fontSize: 20, color: "#737373", marginTop: 36 }}>
                ✓ Verificado · builder.rodriheredia.com/cert/{certificate.code}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 48, fontWeight: 700, marginTop: 32 }}>
              Certificado no válido
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
