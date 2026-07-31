// ─────────────────────────────────────────────────────────────────────────
// Link-in-bio config. Edita SOLO este archivo para personalizar tu página
// pública en /bio. Es lo único que tocas para cambiar foto, textos y links.
// ─────────────────────────────────────────────────────────────────────────

import type { RegistroIntent } from "@/lib/attribution";

export type BrandKey = "tiktok" | "instagram" | "whatsapp";

// ¿Mostrar la tarjeta de app destacada? Pon en false para ocultarla sin
// tocar nada más.
export const APP_DESTACADA_ACTIVA = true;

export type BioCourse = {
  tag: string;
  name: string;
  note: string;
  price: string;
  // intent=explore para el curso gratis; intent=buy para los de pago.
  // El link real (con UTMs) lo arma /bio según el ?src= de la visita.
  intent: RegistroIntent;
  // Slug del PRODUCTO (el de /admin/productos, no el del programa) que se debe
  // comprar al tocar esta tarjeta. Obligatorio en las tarjetas de pago: sin
  // esto, todas mandaban al mismo sitio y se perdía qué producto quería el
  // visitante. Si el slug no coincide con ningún producto, el LMS cae al
  // comportamiento anterior (ofrece el primer programa bloqueado).
  productSlug?: string;
  cta: string;
  // true = tarjeta destacada (héroe).
  highlight?: boolean;
};

export type BioSocial = {
  brand: BrandKey;
  label: string;
  href: string;
};

export const bioConfig = {
  profile: {
    name: "Rodrigo HeredIA",
    initials: "RH",
    // Foto. Para cambiarla, reemplaza public/bio/rodrigo.jpg.
    photoSrc: "/bio/rodrigo.jpg" as string | null,
    title: "CIO · Founder de Builder HeredIA",
    tagline: "Te enseño a construir productos reales con IA, paso a paso.",
    verified: true,
  },

  // Orden pensado como embudo: primero el gratis (héroe), luego el tripwire
  // de USD 9.99, luego el flagship de USD 47.
  courses: [
    {
      tag: "Empieza aquí · Gratis",
      name: "Claude desde Cero",
      note: "Tu punto de entrada · sin tarjeta",
      price: "Gratis",
      intent: "explore",
      cta: "Empezar gratis →",
      highlight: true,
    },
    {
      tag: "El del Live",
      name: "Agente de Noticias de IA",
      note: "El programa de mi Live · paso a paso",
      price: "USD 9.99",
      intent: "buy",
      productSlug: "agente-noticias-ia-1-hora",
      cta: "Obtener →",
    },
    {
      tag: "Insignia",
      name: "Builder Multi-IA",
      note: "El recorrido completo, módulo a módulo",
      price: "USD 47",
      intent: "buy",
      productSlug: "build-ideacash-founder-access",
      cta: "Activar →",
    },
  ] satisfies BioCourse[],

  // Tarjeta de app destacada (solo visible si APP_DESTACADA_ACTIVA).
  appDestacada: {
    tag: "App · Decisiones con IA",
    title: "Consejo Estratégico",
    note: "3 IAs analizan tu decisión y te dan una recomendación clara.",
    cta: "Abrir",
    href: "https://consejoia.rodriheredia.com",
  },

  // Canal de WhatsApp destacado (tarjeta propia, antes de las redes).
  // La URL del canal NO vive aquí: el botón pasa por /go/whatsapp (para medir
  // clics) y ese redirect usa getCommunityUrl() en src/lib/community.ts, que
  // es la única fuente de verdad de la URL del canal.
  channel: {
    title: "Únete a mi Canal de WhatsApp",
    note: "Novedades, nuevos módulos y Lives — directo a tu WhatsApp. Gratis.",
    cta: "Unirme al canal",
  },

  socials: [
    {
      brand: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@rodrigo_heredia_cio",
    },
    {
      brand: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/rodrigo_heredia_cio",
    },
  ] satisfies BioSocial[],

  // Nota sutil de programas próximos (no clickeable).
  upcoming: {
    label: "5 programas más en construcción",
    note: "Síguelos primero desde el canal de WhatsApp.",
  },
};
