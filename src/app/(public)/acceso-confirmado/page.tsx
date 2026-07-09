import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Revisa tu correo | Builder HeredIA",
  description:
    "Te enviamos un enlace seguro de acceso. Ábrelo desde tu correo para entrar al LMS.",
};

const steps = [
  {
    title: "Abre tu correo",
    detail:
      "Te enviamos un enlace de acceso al email que ingresaste. Llega en segundos.",
  },
  {
    title: "Haz click en el enlace",
    detail:
      'El botón "Entrar a Builder HeredIA" te lleva directo a tu cuenta, sin contraseña.',
  },
  {
    title: "Revisa spam si no llega",
    detail:
      "Si no lo ves en 1-2 minutos, busca en spam o promociones. El enlace expira pronto por seguridad.",
  },
];

export default function AccesoConfirmadoPage() {
  return (
    <div className="mx-auto max-w-2xl py-8 text-white sm:py-12">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/40 backdrop-blur sm:p-9">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-2xl">
          ✉️
        </div>

        <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-sky-300">
          Enlace enviado
        </p>
        <h1 className="mt-3 text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl">
          Revisa tu correo para entrar
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-300">
          Te enviamos un enlace seguro de acceso. Ábrelo desde tu bandeja de
          entrada y entrarás a Builder HeredIA automáticamente — sin contraseña.
        </p>

        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-neutral-950">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-neutral-400">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex justify-center rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-sky-400/60 hover:bg-sky-400/10"
          >
            Volver a intentar
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-neutral-300 transition hover:text-white"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
