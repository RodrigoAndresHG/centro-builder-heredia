import Link from "next/link";

const valueCards = [
  {
    title: "Programas activos",
    description:
      "Accede a rutas de aprendizaje organizadas dentro de una plataforma privada, clara y pensada para ayudarte a enfocarte en lo importante.",
  },
  {
    title: "Lecciones y continuidad",
    description:
      "Avanza módulo por módulo, retoma donde te quedaste y sigue una secuencia útil sin perder tiempo buscando qué sigue.",
  },
  {
    title: "Updates del build",
    description:
      "Recibe nuevas publicaciones, cambios del build y contenido adicional dentro del mismo entorno donde consumes el programa.",
  },
  {
    title: "Soporte y acceso centralizado",
    description:
      "Todo lo que compraste, tu estado de acceso y la ayuda que necesitas, en un solo lugar.",
  },
];

const productBullets = [
  "Aprende a replicar la app desde cero",
  "Entiende cómo conectar OpenAI, Anthropic y Gemini",
  "Accede a módulos, lecciones y updates del build dentro de la plataforma",
];

const steps = [
  {
    title: "Compras acceso",
    description:
      "Entras al producto activo y completas tu compra de forma segura dentro del flujo de pago.",
  },
  {
    title: "Entras a tu cuenta",
    description:
      "Accedes a tu perfil privado y el sistema refleja automáticamente el acceso correspondiente.",
  },
  {
    title: "Consumes el programa",
    description:
      "Avanzas por módulos, lecciones y contenido publicado dentro de una estructura clara.",
  },
  {
    title: "Continúas dentro del sistema",
    description:
      "Retomas donde te quedaste, sigues el progreso y recibes updates del build dentro de la misma plataforma.",
  },
];

const evidenceCards = [
  {
    title: "Dashboard privado",
    description:
      "El usuario entra a un panel donde ve su estado, su acceso activo y el siguiente paso recomendado.",
    label: "Acceso activo",
  },
  {
    title: "Programa activo",
    description:
      "El contenido no está suelto: vive dentro de una estructura clara de programa, módulos y lecciones.",
    label: "6 lecciones",
  },
  {
    title: "Vista de lección",
    description:
      "Cada lección forma parte de una continuidad real, con avance, navegación y contexto dentro del build.",
    label: "Completada",
  },
  {
    title: "Checkout y acceso",
    description:
      "La compra, el retorno a la plataforma y la activación del acceso ya funcionan dentro del flujo real del producto.",
    label: "Stripe OK",
  },
];

const faqs = [
  {
    question: "¿Qué obtengo al comprar?",
    answer:
      "Obtienes acceso privado al producto activo dentro de Centro Builder HeredIA, incluyendo programa, módulos, lecciones, updates del build y continuidad de aprendizaje dentro de la misma plataforma.",
  },
  {
    question: "¿El acceso se activa automáticamente?",
    answer:
      "Sí. Cuando el pago se procesa correctamente, el sistema activa tu acceso y lo refleja en tu cuenta para que puedas entrar al contenido correspondiente.",
  },
  {
    question: "¿Qué voy a aprender dentro?",
    answer:
      "Vas a entrar al build real de IdeaCash para entender su estructura, su lógica y cómo replicar una app Multi-IA desde cero, incluyendo el criterio para conectar OpenAI, Anthropic y Gemini dentro de un solo producto.",
  },
  {
    question: "¿Dónde veo lo que compré?",
    answer:
      "Dentro de tu dashboard privado, en la sección de programas y contenido disponible, donde también podrás continuar tu avance y revisar updates.",
  },
  {
    question: "¿Qué hago si necesito ayuda?",
    answer:
      "Puedes usar los canales de soporte dentro de la plataforma para resolver dudas de acceso, compra o uso del contenido.",
  },
];

function PrimaryCta({ children }: { children: string }) {
  return (
    <Link
      href="/registro"
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-teal-300"
    >
      {children}
    </Link>
  );
}

function SecondaryCta({ children }: { children: string }) {
  return (
    <Link
      href="/login"
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-neutral-500"
    >
      {children}
    </Link>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase text-teal-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-neutral-300">{description}</p>
      ) : null}
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-300">App privada</p>
          <p className="mt-1 text-sm font-semibold text-white">
            Centro Builder HeredIA
          </p>
        </div>
        <span className="rounded-md bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
          Acceso activo
        </span>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          {["Dashboard", "Programas", "Updates", "Soporte"].map((item) => (
            <div
              key={item}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <p className="text-xs font-semibold uppercase text-teal-300">
              Programa activo
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Build IdeaCash — Founder Access
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Siguiente: Mapa de idea a oferta
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full w-2/5 rounded-full bg-teal-400" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Módulos", "2"],
              ["Lecciones", "6"],
              ["Progreso", "40%"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-neutral-800 bg-neutral-950 p-3"
              >
                <p className="text-xs text-neutral-500">{label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-teal-400/30 bg-teal-400/10 p-4">
            <p className="text-sm font-semibold text-teal-100">
              Compra, acceso y continuidad dentro del mismo flujo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidencePreview({ label }: { label: string }) {
  return (
    <div className="mt-5 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
      <div className="flex items-center justify-between">
        <div className="h-2 w-24 rounded-full bg-neutral-700" />
        <span className="rounded-md bg-teal-400/10 px-2 py-1 text-xs font-semibold text-teal-300">
          {label}
        </span>
      </div>
      <div className="mt-4 grid gap-2">
        <div className="h-10 rounded-md border border-neutral-800 bg-neutral-900" />
        <div className="h-10 rounded-md border border-neutral-800 bg-neutral-900" />
        <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
          <div className="h-full w-3/5 rounded-full bg-teal-400" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 bg-neutral-950 text-white sm:-my-14">
      <section className="border-b border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase text-teal-300">
              Centro Builder HeredIA
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              No compres solo contenido. Entra al entorno privado donde conviertes
              ideas en productos más claros, vendibles y mejor construidos.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Accede a programas, lecciones, updates del build y una experiencia
              privada pensada para ayudarte a aprender, avanzar y construir con
              más criterio.
            </p>

            <div className="mt-7 grid gap-3 text-sm text-neutral-200 sm:grid-cols-3">
              {[
                "Acceso privado inmediato",
                "Aprendizaje estructurado por programas",
                "Updates y progreso dentro de la plataforma",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Comprar acceso</PrimaryCta>
              <SecondaryCta>Iniciar sesión</SecondaryCta>
            </div>
          </div>

          <ProductPreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <SectionIntro
          title="Todo lo que necesitas dentro de un solo entorno privado"
          description="Centro Builder HeredIA no entrega solo contenido. Te da una experiencia organizada para acceder, aprender, avanzar y mantenerte dentro del producto sin fricción."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {valueCards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm shadow-black/20"
            >
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-300">
              Producto activo ahora
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Build IdeaCash — Founder Access
            </h2>
            <p className="mt-5 text-base leading-8 text-neutral-300">
              Accede al build real de IdeaCash dentro de Centro Builder HeredIA y
              aprende cómo replicar una app Multi-IA desde cero, entendiendo su
              estructura, su lógica y la forma en que conecta múltiples modelos en
              un solo producto.
            </p>
            <p className="mt-5 text-base leading-8 text-neutral-400">
              No entras a un curso genérico ni a una carpeta suelta. Entras a una
              experiencia privada donde ves cómo se construye una app real, cómo
              se conectan OpenAI, Anthropic y Gemini, y cómo esa arquitectura se
              convierte en un producto utilizable.
            </p>
            <div className="mt-7">
              <PrimaryCta>Comprar acceso</PrimaryCta>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
            <div className="space-y-3">
              {productBullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm font-medium text-neutral-100"
                >
                  {bullet}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <SectionIntro
          title="Cómo funciona"
          description="Centro Builder HeredIA está pensado para que el paso entre compra, acceso y aprendizaje se sienta claro, directo y sin fricción."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal-400 text-sm font-bold text-neutral-950">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <SectionIntro
            title="Así se ve la experiencia por dentro"
            description="Centro Builder HeredIA ya funciona como una plataforma privada real: acceso, programas, progreso, soporte y activación comercial dentro del mismo entorno."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {evidenceCards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
              >
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {card.description}
                </p>
                <EvidencePreview label={card.label} />
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-neutral-300">
            No estás entrando a una promesa. Estás entrando a una plataforma que
            ya tiene flujo privado, contenido, acceso y operación comercial
            funcionando.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <SectionIntro
            title="Accede hoy al producto activo"
            description="Empieza con Build IdeaCash — Founder Access dentro del entorno privado de Centro Builder HeredIA y entra a una experiencia pensada para aprender, replicar y avanzar con más criterio."
          />
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-400">
            No compras solo acceso a contenido. Entras a un entorno donde puedes
            entender el build, seguir su evolución y usarlo como base para
            construir mejor.
          </p>
        </div>

        <div className="rounded-xl border border-teal-400/30 bg-teal-400/10 p-6 shadow-xl shadow-black/20">
          <p className="text-sm font-semibold uppercase text-teal-200">
            Founder Access
          </p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-semibold text-white">USD 47</span>
          </div>
          <p className="mt-5 text-sm leading-7 text-neutral-200">
            Acceso privado, programa activo, módulos y lecciones, updates del
            build, continuidad de aprendizaje y soporte dentro de la plataforma.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <PrimaryCta>Comprar acceso</PrimaryCta>
            <SecondaryCta>Iniciar sesión</SecondaryCta>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <SectionIntro title="Preguntas frecuentes" />
        <div className="mt-8 divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5">
              <summary className="cursor-pointer list-none text-base font-semibold text-white">
                {faq.question}
              </summary>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-300">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
