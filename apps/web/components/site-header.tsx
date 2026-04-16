"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { getUiCopy } from "@/lib/copy";
import { PRIMARY_NAV_ITEMS, resolvePrimaryNavId, resolveSwipeNavigation } from "@/lib/navigation";
import { getProductCopy } from "@/lib/product-copy";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const navSwipePreference = usePlannerUiStore((state) => state.state.navSwipePreference);
  const setNavSwipePreference = usePlannerUiStore((state) => state.setNavSwipePreference);
  const isPhoneViewport = usePhoneViewport();
  const copy = getUiCopy(locale);
  const productCopy = getProductCopy(locale);
  const activeTab = resolvePrimaryNavId(pathname);
  const gestureStartX = useRef<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = PRIMARY_NAV_ITEMS.map((item) => ({
    href: item.href,
    id: item.id,
    label:
      item.id === "home"
        ? copy.common.home
        : item.id === "planner"
        ? copy.common.planner
        : copy.common.calendar,
  }));
  const secondaryLinks = [
    {
      href: "/project",
      label: productCopy.siteHeader.secondaryNav.project,
    },
    {
      href: "/connect-ai",
      label: productCopy.siteHeader.secondaryNav.connectToAi,
    },
    {
      href: "/inscripciones",
      label: productCopy.siteHeader.secondaryNav.inscriptions,
    },
    {
      href: "/planner/settings",
      label: productCopy.siteHeader.secondaryNav.configuration,
    },
  ] as const;

  function commitSwipe(clientX: number) {
    if (!isPhoneViewport || gestureStartX.current === null) {
      return;
    }

    const result = resolveSwipeNavigation(pathname, clientX - gestureStartX.current, navSwipePreference);
    gestureStartX.current = null;

    if (!result || result.href === pathname) {
      return;
    }

    if (navSwipePreference === null && result.preferenceToPersist) {
      setNavSwipePreference(result.preferenceToPersist);
    }

    router.push(result.href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/84 backdrop-blur-xl">
      <div
        className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8"
        style={{ paddingTop: "max(env(safe-area-inset-top), 1rem)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isPhoneViewport ? (
              <button
                aria-label={productCopy.siteHeader.mobileMenuLabel}
                className="nav-pill rounded-full px-3 py-2 text-sm text-foreground hover:bg-surface-elevated"
                onClick={() => setMobileMenuOpen((current) => !current)}
                type="button"
              >
                {productCopy.common.menu}
              </button>
            ) : null}
            <Link className="font-display text-2xl text-foreground" href="/" prefetch={false}>
              {copy.plannerHome.title}
            </Link>
            <span className="rounded-full border border-accent/12 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {copy.siteHeader.badge}
            </span>
          </div>

          {!isPhoneViewport ? (
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  className="nav-pill rounded-full px-3 py-2 transition hover:bg-surface-elevated hover:text-foreground"
                  href={link.href}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                aria-label={productCopy.siteHeader.searchLabel}
                className="nav-pill rounded-full px-3 py-2 transition hover:bg-surface-elevated hover:text-foreground"
                href="/search"
                prefetch={false}
              >
                {productCopy.common.search}
              </Link>
            </div>
          ) : null}
        </div>

        <nav
          className="mobile-nav-shell flex flex-wrap items-center gap-2 text-sm font-medium text-muted"
          onPointerDown={
            isPhoneViewport
              ? (event) => {
                  gestureStartX.current = event.clientX;
                }
              : undefined
          }
          onPointerUp={
            isPhoneViewport
              ? (event) => {
                  commitSwipe(event.clientX);
                }
              : undefined
          }
          onTouchStart={
            isPhoneViewport
              ? (event) => {
                  gestureStartX.current = event.touches[0]?.clientX ?? null;
                }
              : undefined
          }
          onTouchEnd={
            isPhoneViewport
              ? (event) => {
                  commitSwipe(event.changedTouches[0]?.clientX ?? 0);
                }
              : undefined
          }
        >
          {links.map((link) => (
            <Link
              key={link.href}
              className={[
                "nav-pill rounded-full px-3 py-2 transition",
                activeTab === link.id
                  ? "bg-accent text-accent-contrast shadow-[0_10px_24px_rgba(31,77,63,0.14)]"
                  : "hover:bg-surface-elevated hover:text-foreground",
              ].join(" ")}
              href={link.href}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {isPhoneViewport && mobileMenuOpen ? (
          <div className="grid gap-2 rounded-[1.5rem] border border-border bg-surface-elevated p-3 text-sm font-medium text-muted">
            {[...secondaryLinks, { href: "/search", label: productCopy.common.search }, { href: "/mapa", label: productCopy.common.map }].map((link) => (
              <Link
                key={link.href}
                className="nav-pill rounded-full px-3 py-2 transition hover:bg-surface-hover hover:text-foreground"
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
