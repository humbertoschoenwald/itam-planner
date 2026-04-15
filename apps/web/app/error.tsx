"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { clearPlannerBrowserState } from "@/lib/browser-state";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    clearPlannerBrowserState();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <section className="section-shell space-y-4">
        <p className="eyebrow">Recuperación</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Reiniciamos el estado local para salir del fallo.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
          La ruta actual lanzó un error de runtime. Para evitar loops del navegador, el estado local
          del planner de este dispositivo se limpió automáticamente. Vuelve a onboarding y reconstruye
          el contexto desde cero.
        </p>
        <p className="text-xs leading-5 text-muted">
          {error.digest ? `Referencia técnica: ${error.digest}` : "No se expuso un digest de error."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/onboarding?recovered=1" prefetch={false}>
              Volver a onboarding
            </Link>
          </Button>
          <Button onClick={reset} variant="secondary">
            Reintentar
          </Button>
        </div>
      </section>
    </main>
  );
}
