// ─────────────────────────────────────────────────────────────────────────
// Link-in-bio config. Edita SOLO este archivo para personalizar tu página
// pública en /bio. Es lo único que tocas para cambiar foto, textos y links.
// ─────────────────────────────────────────────────────────────────────────

export type BrandKey = "tiktok" | "instagram" | "whatsapp";

export type BioLink = {
  // icon = emoji para cursos/LMS. Para redes usa `brand` y se renderiza
  // el logo oficial (icon se ignora si hay brand).
  icon: string;
  brand?: BrandKey;
  title: string;
  subtitle: string;
  href: string;
  // Opcional: link que abre la app nativa directamente (esquema o universal
  // link). Si está, se usa en vez de href para abrir la app y no la web.
  appHref?: string;
  // "live" resalta la tarjeta (úsalo en tu oferta principal).
  tone: "live" | "flagship" | "free" | "channel" | "social";
};

export const bioConfig = {
  profile: {
    name: "Rodrigo HeredIA",
    initials: "RH",
    // Foto hero. Para cambiarla, reemplaza public/bio/rodrigo.jpg.
    photoSrc: "/bio/rodrigo.jpg" as string | null,
    title: "CIO · Founder de Builder HeredIA",
    tagline:
      "Lidero tecnología con IA y te enseño a construir productos reales, paso a paso y sin relleno.",
    verified: true,
  },

  stats: [
    { value: "3", label: "Programas" },
    { value: "Multi-IA", label: "OpenAI · Claude · Gemini" },
    { value: "LMS", label: "Entorno privado" },
  ],

  // Tarjeta destacada arriba de los links (tu oferta principal del momento).
  featured: {
    badge: "En vivo · Jueves 9PM · TikTok",
    title: "Crea tu Agente de Noticias de IA en 1 Hora",
    description:
      "El programa que construyo en vivo. Llévate el paso a paso completo para dejar tu agente funcionando.",
    price: "USD 9.99",
    href: "/registro?intent=buy",
    cta: "Obtener el programa",
  },

  links: [
    {
      icon: "🚀",
      title: "Builder Multi-IA",
      subtitle: "Programa insignia · USD 47",
      href: "/registro?intent=buy",
      tone: "flagship",
    },
    {
      icon: "🎓",
      title: "Claude desde Cero",
      subtitle: "Empieza gratis · sin tarjeta",
      href: "/registro?intent=explore",
      tone: "free",
    },
    {
      icon: "📣",
      brand: "whatsapp",
      title: "Canal de WhatsApp",
      subtitle: "Novedades, módulos y Lives",
      href: "https://whatsapp.com/channel/0029VbD3AGkLikg5aJbgRq0l",
      tone: "channel",
    },
    {
      icon: "🎵",
      brand: "tiktok",
      title: "TikTok",
      subtitle: "@rodrigo_heredia_cio",
      href: "https://www.tiktok.com/@rodrigo_heredia_cio",
      tone: "social",
    },
    {
      icon: "📸",
      brand: "instagram",
      title: "Instagram",
      subtitle: "@rodrigo_heredia_cio",
      href: "https://www.instagram.com/rodrigo_heredia_cio",
      // Abre la app de Instagram directamente (no la web).
      appHref: "instagram://user?username=rodrigo_heredia_cio",
      tone: "social",
    },
    {
      icon: "🌐",
      title: "Entrar al LMS",
      subtitle: "builder.rodriheredia.com",
      href: "/",
      tone: "social",
    },
  ] satisfies BioLink[],

  // Nota sutil de programas próximos (no clickeable).
  upcoming: {
    label: "5 programas más en construcción",
    note: "Síguelos primero desde el canal de WhatsApp.",
  },
};
