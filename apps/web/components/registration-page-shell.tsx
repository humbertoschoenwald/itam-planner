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

export function RegistrationPageShell(): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getProductCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="surface-card section-shell overflow-hidden rounded-[2rem] border border-border/80 px-4 py-4 shadow-[var(--shadow-strong)] sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className="page-hero-grid">
          <div className="section-intro">
            <p className="eyebrow text-accent">{copy.common.registration}</p>
            <h1 className="max-w-[10.5ch] text-balance font-display text-[clamp(1.7rem,6vw,4rem)] leading-[0.95] text-foreground">
              {copy.registrationPage.title}
            </h1>
            <p className="max-w-3xl text-[0.94rem] leading-6 text-muted sm:text-lg sm:leading-7">
              {copy.registrationPage.body}
            </p>
          </div>

          <div className="page-aside-grid">
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.registrationPage.traceability}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {copy.registrationPage.steps[0]}
              </p>
            </div>
            <div className="detail-card">
              <p className="eyebrow text-accent">{copy.registrationPage.sourceLabels.destination}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {copy.registrationPage.steps[1]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="step-grid">
        {copy.registrationPage.steps.map((step) => (
          <div key={step} className="detail-card text-sm leading-6 text-muted">
            {step}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{copy.registrationPage.traceability}</p>
        <div className="resource-grid">
          {OFFICIAL_REGISTRATION_SOURCES.map((source) => (
            <a
              key={source.href}
              className="support-link block text-left"
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
