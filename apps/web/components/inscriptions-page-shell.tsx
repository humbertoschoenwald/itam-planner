"use client";

import { getProductCopy } from "@/lib/product-copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

const OFFICIAL_INSCRIPTIONS_SOURCES = [
  {
    href: "https://servicios.itam.mx/",
    label: "Servicios ITAM",
  },
  {
    href: "https://alter.itam.mx:8443/StudentRegistrationSsb/ssb/registration?mepCode=EDSUP",
    label: "Official inscriptions destination",
  },
];

export function InscriptionsPageShell() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getProductCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="space-y-3">
        <p className="eyebrow">{copy.common.inscriptions}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {copy.inscriptionsPage.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">
          {copy.inscriptionsPage.body}
        </p>
      </div>

      <div className="grid gap-3">
        {copy.inscriptionsPage.steps.map((step) => (
          <div key={step} className="soft-panel text-sm leading-6 text-muted">
            {step}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{copy.inscriptionsPage.traceability}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {OFFICIAL_INSCRIPTIONS_SOURCES.map((source) => (
            <a
              key={source.href}
              className="choice-card block text-left"
              href={source.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="block font-semibold text-foreground">{source.label}</span>
              <span className="mt-2 block text-sm leading-6 text-muted">{source.href}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
