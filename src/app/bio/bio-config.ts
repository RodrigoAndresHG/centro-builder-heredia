// ─────────────────────────────────────────────────────────────────────────
// Link-in-bio config. Edita SOLO este archivo para personalizar tu página
// pública en /bio. Es lo único que tocas para cambiar foto, textos y links.
// ─────────────────────────────────────────────────────────────────────────

export type BioLink = {
  icon: string;
  title: string;
  subtitle: string;
  href: string;
  // "live" resalta la tarjeta (úsalo en tu oferta principal).
  tone: "live" | "flagship" | "free" | "channel" | "social";
};

export const bioConfig = {
  profile: {
    name: "Rodrigo HeredIA",
    initials: "RH",
    // Para usar TU foto: sube el archivo a public/bio/rodrigo.jpg y cambia
    // esta línea a:  photoSrc: "/bio/rodrigo.jpg"
    photoSrc: null as string | null,
    title: "Founder · Builder HeredIA LMS",
    tagline:
      "Construyo productos reales con IA y te enseño a hacerlo paso a paso, sin relleno.",
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
      title: "Canal de WhatsApp",
      subtitle: "Novedades, módulos y Lives",
      href: "https://whatsapp.com/channel/0029VbD3AGkLikg5aJbgRq0l",
      tone: "channel",
    },
    {
      icon: "🌐",
      title: "Entrar al LMS",
      subtitle: "builder.rodriheredia.com",
      href: "/",
      tone: "social",
    },
    // ↓ Reemplaza el href con tu link real de TikTok y descomenta para mostrarlo.
    // {
    //   icon: "🎵",
    //   title: "TikTok",
    //   subtitle: "@tu_usuario",
    //   href: "https://www.tiktok.com/@tu_usuario",
    //   tone: "social",
    // },
  ] satisfies BioLink[],
};
