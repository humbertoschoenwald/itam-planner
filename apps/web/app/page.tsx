import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://itam.humbertoschoenwald.com/",
  },
  description:
    "Home público de ITAM Planner: onboarding local, planner separado y catálogo académico precalculado para aparecer mejor en buscadores y asistentes.",
  title: "Home",
};

const panels = [
  {
    title: "Sin muro de cuentas",
    body: "Empiezas en tu navegador. No hay sign-in, no hay perfil del alumno en el servidor y no hay identidad de horario guardada en la nube.",
  },
  {
    title: "Catálogo precalculado",
    body: "Las relaciones entre materias, periodos y documentos públicos se sirven desde JSON promovidos y cacheados, no desde cálculos por request.",
  },
  {
    title: "Planner en su propia ruta",
    body: "El home se mantiene ligero. El shell real del planner vive en /planner y depende de un onboarding local en /onboarding.",
  },
] as const;

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description:
      "Proyecto independiente para planeación académica del ITAM con onboarding local, planner dedicado y catálogo público precalculado.",
    inLanguage: "es-MX",
    name: "ITAM Planner",
    publisher: {
      "@type": "Person",
      name: "Humberto Schoenwald",
    },
    url: "https://itam.humbertoschoenwald.com/",
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <section className="overflow-hidden rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_30px_90px_rgba(40,43,24,0.08)] sm:p-8">
        <div className="hero-grid">
          <div className="space-y-5">
            <p className="eyebrow text-accent">Inicio</p>
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">
                Un home ligero para entrar al planner sin romper la carga inicial.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Primero haces onboarding, después entras al planner. Tu contexto académico se
                queda en este navegador y el catálogo público ya viene precalculado.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/onboarding" prefetch={false}>
                  Empezar onboarding
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/planner" prefetch={false}>
                  Abrir planner
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/community" prefetch={false}>
                  Comunidad
                </Link>
              </Button>
            </div>
          </div>

          <div className="glass-accent rounded-[1.9rem] border border-white/10 px-5 py-5 shadow-[0_24px_50px_rgba(18,40,33,0.26)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-inverse-muted">
              Proyecto independiente
            </p>
            <p className="mt-3 text-sm leading-6 text-inverse-muted">
              Proyecto open-source independiente, construido por la comunidad. No afiliado,
              respaldado ni mantenido por el Instituto Tecnológico Autónomo de México (ITAM).
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {panels.map((panel) => (
                <div key={panel.title} className="rounded-2xl bg-white/8 p-4 text-sm leading-6 text-inverse-muted">
                  <p className="font-semibold text-accent-contrast">{panel.title}</p>
                  <p className="mt-2">{panel.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-grid">
        <Card>
          <CardHeader>
            <p className="eyebrow">Ruta sugerida</p>
            <CardTitle>1. /onboarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted">
            <p>
              Define tu periodo de ingreso, tus planes activos y el idioma preferido. Nada de eso
              sale de este navegador.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="eyebrow">Siguiente paso</p>
            <CardTitle>2. /planner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted">
            <p>
              El planner ya no comparte la misma carga del home. Si todavía no hiciste onboarding,
              esa ruta te regresa a `/onboarding`.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
