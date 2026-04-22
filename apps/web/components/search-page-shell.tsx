"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  buildLocalSearchIndex,
  getOfficialNewsItems,
  searchLocalIndex,
  type SearchIndexBootstrap,
} from "@/lib/presenters/official-content";
import { getProductCopy } from "@/lib/product-copy";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type SearchPageShellProps = {
  bootstrap: SearchIndexBootstrap;
}

export function SearchPageShell({ bootstrap }: SearchPageShellProps): React.JSX.Element {
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const copy = getProductCopy(locale);
  const [query, setQuery] = useState("");

  const localizedBootstrap = useMemo(
    () => ({
      ...bootstrap,
      newsItems: [...getOfficialNewsItems(locale)],
    }),
    [bootstrap, locale],
  );
  const index = useMemo(
    () => buildLocalSearchIndex(localizedBootstrap, locale),
    [localizedBootstrap, locale],
  );
  const results = useMemo(() => searchLocalIndex(index, query), [index, query]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="space-y-3">
        <p className="eyebrow">{copy.searchPage.eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {copy.searchPage.title}
        </h1>
      </div>

      <label className="space-y-3">
        <span className="text-sm font-medium text-foreground">{copy.searchPage.inputLabel}</span>
        <input
          className="field-shell text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPage.inputPlaceholder}
          type="search"
          value={query}
        />
      </label>

      {results.length === 0 ? (
        <div className="soft-panel text-sm leading-6 text-muted">{copy.searchPage.empty}</div>
      ) : (
        <div className="grid gap-3">
          {results.map((item) => (
            <Link
              key={`${item.href}:${item.title}`}
              className="choice-card block text-left"
              href={item.href}
              prefetch={false}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              target={item.href.startsWith("http") ? "_blank" : undefined}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {item.category}
              </p>
              <p className="mt-2 font-semibold text-foreground">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
