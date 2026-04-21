import type { Metadata } from "next";

import { PlannerSettingsShell } from "@/components/planner-settings-shell";
import { readPlannerSettingsBootstrap } from "@/lib/presenters/bootstrap-server";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "settings");

export default async function SettingsPage() {
  const bootstrap = await readPlannerSettingsBootstrap();

  return (
    <PlannerSettingsShell
      bulletinDocuments={bootstrap.bulletinDocuments}
      periods={bootstrap.periods}
    />
  );
}
