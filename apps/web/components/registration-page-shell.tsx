"use client";

import { getProductCopy } from "@/lib/product-copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

const OFFICIAL_REGISTRATION_SOURCES = [
  {
    href: "https://servicios.itam.mx/",
    labelKey: "services" as const,
  },
  {
    href: "https://alter.itam.mx:8443/StudentRegistrationSsb/ssb/registration?mepCode=EDSUP",
    labelKey: "destination" as const,
  },
];

export function RegistrationPageShell() {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getProductCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="space-y-3">
        <p className="eyebrow">{copy.common.registration}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {copy.registrationPage.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">
          {copy.registrationPage.body}
        </p>
      </div>

      <div className="grid gap-3">
        {copy.registrationPage.steps.map((step) => (
          <div key={step} className="soft-panel text-sm leading-6 text-muted">
            {step}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{copy.registrationPage.traceability}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {OFFICIAL_REGISTRATION_SOURCES.map((source) => (
            <a
              key={source.href}
              className="choice-card block text-left"
              href={source.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="block font-semibold text-foreground">
                {copy.registrationPage.sourceLabels[source.labelKey]}
              </span>
              <span className="mt-2 block text-sm leading-6 text-muted">{source.href}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
