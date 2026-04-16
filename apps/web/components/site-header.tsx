"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getUiCopy } from "@/lib/copy";
import {
  PRIMARY_NAV_ITEMS,
  resolvePrimaryNavId,
  resolveSecondaryNavId,
  resolveSwipeNavigation,
  SECONDARY_NAV_ITEMS,
} from "@/lib/navigation";
import { getProductCopy } from "@/lib/product-copy";
import {
  OFFICIAL_EXECUTIVE_EDUCATION_URL,
  OFFICIAL_ITAM_NEWS_URL,
} from "@/lib/site-content";
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
  const activePrimaryTab = resolvePrimaryNavId(pathname);
  const activeSecondaryTab = resolveSecondaryNavId(pathname);
  const gestureStartX = useRef<number | null>(null);
  const navViewportRef = useRef<HTMLDivElement | null>(null);
  const navMeasureRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapseSecondaryNav, setCollapseSecondaryNav] = useState(isPhoneViewport);

  const primaryLinks = PRIMARY_NAV_ITEMS.map((item) => ({
    href: item.href,
    id: item.id,
    label:
      item.id === "home"
        ? copy.common.home
        : item.id === "planner"
          ? copy.common.planner
          : copy.common.calendar,
  }));
  const secondaryLinks = SECONDARY_NAV_ITEMS.filter(
    (item) => item.id !== "search" && item.id !== "map" && item.id !== "registration",
  ).map((item) => ({
    href: item.href,
    id: item.id,
    label:
      item.id === "project"
        ? productCopy.common.project
        : item.id === "connectAi"
          ? productCopy.common.connectToAi
          : productCopy.common.configuration,
  }));
  const searchLink = {
    href: "/search",
    id: "search" as const,
    label: productCopy.common.search,
  };
  const shouldUseOverflowMenu = isPhoneViewport || collapseSecondaryNav;
  const hiddenOverflowLinks = [
    {
      href: "/registration",
      id: "registration" as const,
      label: productCopy.common.inscriptions,
    },
    {
      href: "/map",
      id: "map" as const,
      label: productCopy.common.map,
    },
    {
      external: true,
      href: OFFICIAL_ITAM_NEWS_URL,
      id: "news" as const,
      label: productCopy.common.news,
    },
    {
      external: true,
      href: OFFICIAL_EXECUTIVE_EDUCATION_URL,
      id: "executiveEducation" as const,
      label: productCopy.common.executiveEducation,
    },
  ];
  const overflowLinks = shouldUseOverflowMenu
    ? [
        ...secondaryLinks,
        searchLink,
        ...hiddenOverflowLinks,
      ]
    : hiddenOverflowLinks;
  const overflowMenuActive =
    activeSecondaryTab !== null &&
    overflowLinks.some(
      (link) => !("external" in link && link.external) && link.id === activeSecondaryTab,
    );
  const shouldRenderOverflowMenuButton = shouldUseOverflowMenu || hiddenOverflowLinks.length > 0;

  useEffect(() => {
    function handleFallbackResize() {
      setCollapseSecondaryNav(window.innerWidth < 1180);
    }

    if (isPhoneViewport) {
      handleFallbackResize();
      return;
    }

    const viewport = navViewportRef.current;
    const measure = navMeasureRef.current;

    if (!viewport || !measure || typeof ResizeObserver === "undefined") {
      handleFallbackResize();
      window.addEventListener("resize", handleFallbackResize);

      return () => {
        window.removeEventListener("resize", handleFallbackResize);
      };
    }

    function handleMeasuredResize() {
      if (!navViewportRef.current || !navMeasureRef.current) {
        return;
      }

      const viewport = navViewportRef.current;
      const measure = navMeasureRef.current;
      const availableWidth = viewport.clientWidth;
      const requiredWidth = measure.scrollWidth;
      setCollapseSecondaryNav(requiredWidth > availableWidth);
    }

    handleMeasuredResize();

    const observer = new ResizeObserver(() => {
      handleMeasuredResize();
    });

    observer.observe(viewport);
    observer.observe(measure);

    return () => {
      observer.disconnect();
    };
  }, [isPhoneViewport, locale]);

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
        <div className="flex items-center gap-4">
          <Link className="font-display text-2xl text-foreground" href="/" prefetch={false}>
            {copy.plannerHome.title}
          </Link>
          <div className="min-w-0 flex-1" ref={navViewportRef}>
            <div
              aria-hidden
              className="pointer-events-none absolute opacity-0"
              ref={navMeasureRef}
            >
              <div className="mobile-nav-shell flex flex-nowrap items-center gap-2 px-1">
                {primaryLinks.map((link) => (
                  <span key={link.href} className="nav-pill inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium">
                    {link.label}
                  </span>
                ))}
                {secondaryLinks.map((link) => (
                  <span key={link.href} className="nav-pill inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium">
                    {link.label}
                  </span>
                ))}
                <span className="nav-pill inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                  {searchLink.label}
                </span>
              </div>
            </div>

            <nav
              className="mobile-nav-shell flex flex-nowrap items-center justify-center gap-2 overflow-x-auto text-sm font-medium text-muted"
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
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  className={getNavPillClassName(activePrimaryTab === link.id)}
                  href={link.href}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ))}

              {!shouldUseOverflowMenu
                ? secondaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      className={getNavPillClassName(activeSecondaryTab === link.id)}
                      href={link.href}
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))
                : null}

              {!shouldUseOverflowMenu ? (
                <Link
                  aria-label={productCopy.siteHeader.searchLabel}
                  className={getIconNavPillClassName(activeSecondaryTab === searchLink.id)}
                  href={searchLink.href}
                  prefetch={false}
                  title={searchLink.label}
                >
                  <SearchIcon />
                </Link>
              ) : null}

              {shouldRenderOverflowMenuButton ? (
                <button
                  aria-expanded={mobileMenuOpen}
                  aria-label={
                    shouldUseOverflowMenu
                      ? productCopy.siteHeader.mobileMenuLabel
                      : productCopy.siteHeader.officialLinksLabel
                  }
                  className={getIconNavPillClassName(mobileMenuOpen || overflowMenuActive)}
                  onClick={() => setMobileMenuOpen((current) => !current)}
                  type="button"
                >
                  <MenuIcon />
                </button>
              ) : null}
            </nav>
          </div>
        </div>

        {shouldRenderOverflowMenuButton && mobileMenuOpen ? (
          <div className="grid gap-2 rounded-[1.5rem] border border-border bg-surface-elevated p-3 text-sm font-medium text-muted">
            {overflowLinks.map((link) =>
              "external" in link && link.external ? (
                <a
                  key={link.href}
                  className={getNavPillClassName(false)}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  className={getNavPillClassName(activeSecondaryTab === link.id)}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function getNavPillClassName(active: boolean) {
  return [
    "nav-pill inline-flex items-center justify-center rounded-full px-3 py-2 transition",
    active
      ? "bg-accent text-accent-contrast shadow-[0_10px_24px_rgba(21,71,58,0.22)]"
      : "text-muted hover:bg-surface-elevated hover:text-foreground",
  ].join(" ");
}

function getIconNavPillClassName(active: boolean) {
  return [
    "nav-pill inline-flex h-10 w-10 items-center justify-center rounded-full transition",
    active
      ? "bg-accent text-accent-contrast shadow-[0_10px_24px_rgba(21,71,58,0.22)]"
      : "text-muted hover:bg-surface-elevated hover:text-foreground",
  ].join(" ");
}

function SearchIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16L21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 7H20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M4 12H20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M4 17H20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
