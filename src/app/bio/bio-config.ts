// ─────────────────────────────────────────────────────────────────────────
// Link-in-bio config. Edita SOLO este archivo para personalizar tu página
// pública en /bio. Es lo único que tocas para cambiar foto, textos y links.
// ─────────────────────────────────────────────────────────────────────────

export type BrandKey = "tiktok" | "instagram" | "whatsapp";

export type BioCourse = {
  tag: string;
  name: string;
  note: string;
  price: string;
  href: string;
  // true = tarjeta destacada (tu oferta principal).
  highlight?: boolean;
};

export type BioSocial = {
  brand: BrandKey;
  label: string;
  href: string;
  // Opcional: abre la app nativa directamente (esquema/universal link).
  appHref?: string;
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

  courses: [
    {
      tag: "El del Live",
      name: "Agente de Noticias de IA",
      note: "El programa de mi Live · paso a paso",
      price: "USD 9.99",
      href: "/registro?intent=buy",
      highlight: true,
    },
    {
      tag: "Gratis",
      name: "Claude desde Cero",
      note: "Tu punto de entrada · sin tarjeta",
      price: "Gratis",
      href: "/registro?intent=explore",
    },
    {
      tag: "Insignia",
      name: "Builder Multi-IA",
      note: "El recorrido completo, módulo a módulo",
      price: "USD 47",
      href: "/registro?intent=buy",
    },
  ] satisfies BioCourse[],

  // Canal de WhatsApp destacado (tarjeta propia, antes de las redes).
  channel: {
    title: "Únete a mi Canal de WhatsApp",
    note: "Novedades, nuevos módulos y Lives — directo a tu WhatsApp. Gratis.",
    cta: "Unirme al canal",
    href: "https://whatsapp.com/channel/0029VbD3AGkLikg5aJbgRq0l",
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
      appHref: "instagram://user?username=rodrigo_heredia_cio",
    },
  ] satisfies BioSocial[],

  // Nota sutil de programas próximos (no clickeable).
  upcoming: {
    label: "5 programas más en construcción",
    note: "Síguelos primero desde el canal de WhatsApp.",
  },
};
