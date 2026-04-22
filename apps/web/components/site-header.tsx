"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { JSX } from "react";
import {
  useLayoutEffect,
  useState,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";

import { getUiCopy } from "@/lib/copy";
import {
  PRIMARY_NAV_ITEMS,
  resolvePrimaryNavId,
  resolveSecondaryNavPresentation,
  resolveSecondaryNavId,
  SECONDARY_NAV_VISIBILITY_ORDER,
  resolveSwipeNavigation,
  SECONDARY_NAV_ITEMS,
  VISIBLE_SECONDARY_NAV_LINK_IDS,
  type SecondaryNavLayout,
  type SecondaryNavVisibilityCandidateId,
  type VisibleSecondaryNavLinkId,
} from "@/lib/navigation";
import {
  OFFICIAL_EXECUTIVE_EDUCATION_URL,
  OFFICIAL_ITAM_NEWS_URL,
} from "@/lib/presenters/official-content";
import { getProductCopy } from "@/lib/product-copy";
import { useElementWidth } from "@/lib/use-element-width";
import { usePhoneViewport } from "@/lib/use-phone-viewport";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

const EMPTY_SECONDARY_NAV_WIDTHS: Record<SecondaryNavVisibilityCandidateId, number> = {
  connectAi: 0,
  project: 0,
  registration: 0,
  search: 0,
  settings: 0,
};
const PRIMARY_LINK_LABELS = {
  home: (copy: ReturnType<typeof getUiCopy>) => copy.common.home,
  planner: (copy: ReturnType<typeof getUiCopy>) => copy.common.planner,
  calendar: (copy: ReturnType<typeof getUiCopy>) => copy.common.calendar,
} as const;
const SECONDARY_LINK_LABELS = {
  connectAi: (productCopy: ReturnType<typeof getProductCopy>) => productCopy.common.connectToAi,
  project: (productCopy: ReturnType<typeof getProductCopy>) => productCopy.common.project,
  registration: (productCopy: ReturnType<typeof getProductCopy>) => productCopy.common.registration,
  settings: (productCopy: ReturnType<typeof getProductCopy>) => productCopy.common.configuration,
} as const;
type SecondaryNavLink = {
  href: string;
  id: VisibleSecondaryNavLinkId;
  label: string;
};
type OverflowLink =
  | ReturnType<typeof buildHiddenOverflowLinks>[number]
  | ReturnType<typeof buildSearchLink>
  | SecondaryNavLink;
type MobileMenuState = {
  open: boolean;
  scopeKey: string;
};

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useStudentProfileStore((state) => state.profile.locale);
  const navSwipePreference = usePlannerUiStore((state) => state.state.navSwipePreference);
  const setNavSwipePreference = usePlannerUiStore((state) => state.setNavSwipePreference);
  const isPhoneViewport = usePhoneViewport();
  const { ref: navigationRef, width: navigationWidth } = useElementWidth<HTMLElement>();
  const copy = getUiCopy(locale);
  const productCopy = getProductCopy(locale);
  const activePrimaryTab = resolvePrimaryNavId(pathname);
  const activeSecondaryTab = resolveSecondaryNavId(pathname);
  const gestureStartX = useRef<number | null>(null);
  const measurementRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuState, setMobileMenuState] = useState<MobileMenuState>({
    open: false,
    scopeKey: "",
  });
  const [secondaryNavCandidateWidths, setSecondaryNavCandidateWidths] = useState(
    EMPTY_SECONDARY_NAV_WIDTHS,
  );
  const [overflowMenuWidth, setOverflowMenuWidth] = useState(0);
  const primaryLinks = buildPrimaryLinks(copy);
  const secondaryLinks = buildSecondaryLinks(productCopy);
  const searchLink = buildSearchLink(productCopy);
  const hiddenOverflowLinks = buildHiddenOverflowLinks(productCopy);
  const secondaryNavPresentation = resolveSecondaryNavPresentation({
    availableWidth: navigationWidth,
    candidateWidths: secondaryNavCandidateWidths,
    isPhoneViewport,
    overflowMenuWidth,
  });
  const secondaryNavLayout = secondaryNavPresentation.layout;
  const visibleSecondaryLinkIds = new Set(
    secondaryNavPresentation.visibleCandidateIds.filter(
      (candidateId): candidateId is VisibleSecondaryNavLinkId => candidateId !== "search",
    ),
  );
  const visibleSecondaryLinks = secondaryLinks.filter((link) => visibleSecondaryLinkIds.has(link.id));
  const showSearchLink = secondaryNavPresentation.visibleCandidateIds.includes("search");
  const overflowLinks = buildOverflowLinks(
    hiddenOverflowLinks,
    searchLink,
    secondaryLinks,
    showSearchLink,
    visibleSecondaryLinkIds,
  );
  const overflowMenuActive = isOverflowMenuActive(activeSecondaryTab, overflowLinks);
  const shouldRenderOverflowMenuButton = overflowLinks.length > 0;
  const currentMobileMenuScopeKey = [
    pathname,
    isPhoneViewport ? "phone" : "non-phone",
    secondaryNavLayout,
  ].join("|");
  const mobileMenuOpen =
    mobileMenuState.open && mobileMenuState.scopeKey === currentMobileMenuScopeKey;

  useMeasuredSecondaryNavWidths({
    measurementRef,
    setOverflowMenuWidth,
    setSecondaryNavCandidateWidths,
  });

  function closeMobileMenu(): void {
    setMobileMenuState((current) => {
      if (!current.open && current.scopeKey === currentMobileMenuScopeKey) {
        return current;
      }

      return {
        open: false,
        scopeKey: currentMobileMenuScopeKey,
      };
    });
  }

  function toggleMobileMenu(): void {
    setMobileMenuState((current) => {
      const isCurrentScopeOpen =
        current.open && current.scopeKey === currentMobileMenuScopeKey;

      return {
        open: !isCurrentScopeOpen,
        scopeKey: currentMobileMenuScopeKey,
      };
    });
  }

  function commitSwipe(clientX: number): void {
    if (!isPhoneViewport || gestureStartX.current === null) {
      return;
    }

    const result = resolveSwipeNavigation(
      pathname,
      clientX - gestureStartX.current,
      navSwipePreference,
    );
    gestureStartX.current = null;

    if (!result || result.href === pathname) {
      return;
    }

    if (navSwipePreference === null && result.preferenceToPersist) {
      setNavSwipePreference(result.preferenceToPersist);
    }

    closeMobileMenu();
    router.push(result.href);
  }

  return (
    <HeaderShell
      activePrimaryTab={activePrimaryTab}
      activeSecondaryTab={activeSecondaryTab}
      commitSwipe={commitSwipe}
      closeMobileMenu={closeMobileMenu}
      copy={copy}
      gestureStartX={gestureStartX}
      isPhoneViewport={isPhoneViewport}
      mobileMenuOpen={mobileMenuOpen}
      overflowLinks={overflowLinks}
      overflowMenuActive={overflowMenuActive}
      primaryLinks={primaryLinks}
      productCopy={productCopy}
      navigationRef={navigationRef}
      measurementRef={measurementRef}
      searchLink={searchLink}
      secondaryLinks={visibleSecondaryLinks}
      secondaryNavLayout={secondaryNavLayout}
      showSearchLink={showSearchLink}
      shouldRenderOverflowMenuButton={shouldRenderOverflowMenuButton}
      toggleMobileMenu={toggleMobileMenu}
    />
  );
}

function buildPrimaryLinks(copy: ReturnType<typeof getUiCopy>): {
  href: string;
  id: (typeof PRIMARY_NAV_ITEMS)[number]["id"];
  label: string;
}[] {
  return PRIMARY_NAV_ITEMS.map((item) => ({
    href: item.href,
    id: item.id,
    label: PRIMARY_LINK_LABELS[item.id](copy),
  }));
}

function buildSecondaryLinks(productCopy: ReturnType<typeof getProductCopy>): {
  href: string;
  id: VisibleSecondaryNavLinkId;
  label: string;
}[] {
  return SECONDARY_NAV_ITEMS.filter((item): item is (typeof SECONDARY_NAV_ITEMS)[number] & {
    id: VisibleSecondaryNavLinkId;
  } =>
    VISIBLE_SECONDARY_NAV_LINK_IDS.includes(item.id as VisibleSecondaryNavLinkId)
  ).map((item) => ({
    href: item.href,
    id: item.id,
    label: SECONDARY_LINK_LABELS[item.id](productCopy),
  }));
}

function buildSearchLink(productCopy: ReturnType<typeof getProductCopy>): {
  href: string;
  id: "search";
  label: string;
} {
  return {
    href: "/search",
    id: "search",
    label: productCopy.common.search,
  };
}

function buildHiddenOverflowLinks(productCopy: ReturnType<typeof getProductCopy>): ({
  href: string;
  id: "map";
  label: string;
} | {
  external: true;
  href: string;
  id: "executiveEducation" | "news";
  label: string;
})[] {
  return [
    {
      href: "/map",
      id: "map",
      label: productCopy.common.map,
    },
    {
      external: true,
      href: OFFICIAL_ITAM_NEWS_URL,
      id: "news",
      label: productCopy.common.news,
    },
    {
      external: true,
      href: OFFICIAL_EXECUTIVE_EDUCATION_URL,
      id: "executiveEducation",
      label: productCopy.common.executiveEducation,
    },
  ];
}

function buildOverflowLinks(
  hiddenOverflowLinks: ReturnType<typeof buildHiddenOverflowLinks>,
  searchLink: {
    href: string;
    id: "search";
    label: string;
  },
  secondaryLinks: SecondaryNavLink[],
  showSearchLink: boolean,
  visibleSecondaryLinkIds: Set<VisibleSecondaryNavLinkId>,
): OverflowLink[] {
  return [
    ...secondaryLinks.filter((link) => !visibleSecondaryLinkIds.has(link.id)),
    ...(showSearchLink ? [] : [searchLink]),
    ...hiddenOverflowLinks,
  ];
}

function isOverflowMenuActive(
  activeSecondaryTab: ReturnType<typeof resolveSecondaryNavId>,
  overflowLinks: OverflowLink[],
): boolean {
  return (
    activeSecondaryTab !== null &&
    overflowLinks.some(
      (link) => !("external" in link) && link.id === activeSecondaryTab,
    )
  );
}

function startGesture(
  gestureStartX: MutableRefObject<number | null>,
  clientX: number | null,
): void {
  gestureStartX.current = clientX;
}

function OverflowMenu({
  activeSecondaryTab,
  closeMobileMenu,
  overflowLinks,
}: {
  activeSecondaryTab: ReturnType<typeof resolveSecondaryNavId>;
  closeMobileMenu: () => void;
  overflowLinks: ({
    href: string;
    id: string;
    label: string;
  } | {
    external: true;
    href: string;
    id: string;
    label: string;
  })[];
}): JSX.Element {
  return (
    <div className="grid gap-2 rounded-[1.5rem] border border-border bg-surface-elevated p-3 text-sm font-medium text-muted">
      {overflowLinks.map((link) =>
        "external" in link ? (
          <a
            key={link.href}
            className={getNavPillClassName(false, false)}
            href={link.href}
            onClick={closeMobileMenu}
            rel="noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ) : (
          <Link
            key={link.href}
            className={getNavPillClassName(activeSecondaryTab === link.id, false)}
            href={link.href}
            onClick={closeMobileMenu}
            prefetch={false}
          >
            {link.label}
          </Link>
        ),
      )}
    </div>
  );
}

function HeaderShell({
  activePrimaryTab,
  activeSecondaryTab,
  commitSwipe,
  closeMobileMenu,
  copy,
  gestureStartX,
  isPhoneViewport,
  mobileMenuOpen,
  overflowLinks,
  overflowMenuActive,
  primaryLinks,
  productCopy,
  navigationRef,
  measurementRef,
  searchLink,
  secondaryLinks,
  secondaryNavLayout,
  showSearchLink,
  shouldRenderOverflowMenuButton,
  toggleMobileMenu,
}: {
  activePrimaryTab: ReturnType<typeof resolvePrimaryNavId>;
  activeSecondaryTab: ReturnType<typeof resolveSecondaryNavId>;
  commitSwipe: (clientX: number) => void;
  closeMobileMenu: () => void;
  copy: ReturnType<typeof getUiCopy>;
  gestureStartX: MutableRefObject<number | null>;
  isPhoneViewport: boolean;
  mobileMenuOpen: boolean;
  overflowLinks: OverflowLink[];
  overflowMenuActive: boolean;
  primaryLinks: ReturnType<typeof buildPrimaryLinks>;
  productCopy: ReturnType<typeof getProductCopy>;
  navigationRef: ReturnType<typeof useElementWidth<HTMLElement>>["ref"];
  measurementRef: MutableRefObject<HTMLDivElement | null>;
  searchLink: ReturnType<typeof buildSearchLink>;
  secondaryLinks: SecondaryNavLink[];
  secondaryNavLayout: SecondaryNavLayout;
  showSearchLink: boolean;
  shouldRenderOverflowMenuButton: boolean;
  toggleMobileMenu: () => void;
}): JSX.Element {
  return (
    <header className="site-header-shell sticky top-0 z-40 border-b border-border/70 bg-surface/84">
      <div
        className="mx-auto flex w-full max-w-7xl flex-col gap-1.5 px-4 py-1.5 sm:gap-4 sm:px-8 sm:py-4"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0.4rem)" }}
      >
        <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
          <BrandLockup
            eyebrow={copy.homePage.surfaceEyebrow}
            href="/"
            onClick={closeMobileMenu}
            title={copy.plannerHome.title}
          />
          <div className="w-full min-w-0 flex-1">
            <HeaderNavigation
              activePrimaryTab={activePrimaryTab}
              activeSecondaryTab={activeSecondaryTab}
              commitSwipe={commitSwipe}
              closeMobileMenu={closeMobileMenu}
              gestureStartX={gestureStartX}
              isPhoneViewport={isPhoneViewport}
              mobileMenuOpen={mobileMenuOpen}
              navigationRef={navigationRef}
              measurementRef={measurementRef}
              overflowMenuActive={overflowMenuActive}
              primaryLinks={primaryLinks}
              productCopy={productCopy}
              searchLink={searchLink}
              secondaryLinks={secondaryLinks}
              secondaryNavLayout={secondaryNavLayout}
              showSearchLink={showSearchLink}
              shouldRenderOverflowMenuButton={shouldRenderOverflowMenuButton}
              toggleMobileMenu={toggleMobileMenu}
            />
          </div>
        </div>

        {shouldRenderOverflowMenuButton && mobileMenuOpen ? (
          <OverflowMenu
            activeSecondaryTab={activeSecondaryTab}
            closeMobileMenu={closeMobileMenu}
            overflowLinks={overflowLinks}
          />
        ) : null}
      </div>
    </header>
  );
}

function BrandLockup({
  eyebrow,
  href,
  onClick,
  title,
}: {
  eyebrow: string;
  href: string;
  onClick: () => void;
  title: string;
}): JSX.Element {
  return (
    <Link
      className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-[1.2rem] px-0.5 py-0.5 md:gap-3.5"
      href={href}
      onClick={onClick}
      prefetch={false}
    >
      <span aria-hidden className="icon-badge header-brand-mark shrink-0" />
      <span className="min-w-0">
        <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted sm:block">
          {eyebrow}
        </span>
        <span className="block truncate font-display text-[clamp(1.02rem,3.7vw,1.85rem)] leading-none text-foreground">
          {title}
        </span>
      </span>
    </Link>
  );
}

function HeaderNavigation({
  activePrimaryTab,
  activeSecondaryTab,
  commitSwipe,
  closeMobileMenu,
  gestureStartX,
  isPhoneViewport,
  mobileMenuOpen,
  navigationRef,
  measurementRef,
  overflowMenuActive,
  primaryLinks,
  productCopy,
  searchLink,
  secondaryLinks,
  secondaryNavLayout,
  showSearchLink,
  shouldRenderOverflowMenuButton,
  toggleMobileMenu,
}: {
  activePrimaryTab: ReturnType<typeof resolvePrimaryNavId>;
  activeSecondaryTab: ReturnType<typeof resolveSecondaryNavId>;
  commitSwipe: (clientX: number) => void;
  closeMobileMenu: () => void;
  gestureStartX: MutableRefObject<number | null>;
  isPhoneViewport: boolean;
  mobileMenuOpen: boolean;
  navigationRef: ReturnType<typeof useElementWidth<HTMLElement>>["ref"];
  measurementRef: MutableRefObject<HTMLDivElement | null>;
  overflowMenuActive: boolean;
  primaryLinks: ReturnType<typeof buildPrimaryLinks>;
  productCopy: ReturnType<typeof getProductCopy>;
  searchLink: ReturnType<typeof buildSearchLink>;
  secondaryLinks: SecondaryNavLink[];
  secondaryNavLayout: SecondaryNavLayout;
  showSearchLink: boolean;
  shouldRenderOverflowMenuButton: boolean;
  toggleMobileMenu: () => void;
}): JSX.Element {
  return (
    <div className="relative min-w-0">
      <nav
        className="mobile-nav-shell flex w-full min-w-0 flex-nowrap items-center justify-start gap-1.5 overflow-x-auto text-sm font-medium text-muted sm:justify-center sm:gap-2 md:justify-end"
        data-phone-viewport={isPhoneViewport ? "true" : "false"}
        data-secondary-nav-layout={secondaryNavLayout}
        onPointerDown={
          isPhoneViewport ? (event) => startGesture(gestureStartX, event.clientX) : undefined
        }
        onPointerUp={isPhoneViewport ? (event) => commitSwipe(event.clientX) : undefined}
        onTouchEnd={
          isPhoneViewport ? (event) => commitSwipe(event.changedTouches[0]?.clientX ?? 0) : undefined
        }
        onTouchStart={
          isPhoneViewport
            ? (event) => startGesture(gestureStartX, event.touches[0]?.clientX ?? null)
            : undefined
        }
        ref={navigationRef}
      >
        {primaryLinks.map((link) => (
          <Link
            key={link.href}
            className={getNavPillClassName(activePrimaryTab === link.id, isPhoneViewport)}
            href={link.href}
            onClick={closeMobileMenu}
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}

        <SecondaryNavigationLinks
          activeSecondaryTab={activeSecondaryTab}
          closeMobileMenu={closeMobileMenu}
          secondaryLinks={secondaryLinks}
        />

        <NavigationUtilityButtons
          activeSecondaryTab={activeSecondaryTab}
          closeMobileMenu={closeMobileMenu}
          isPhoneViewport={isPhoneViewport}
          mobileMenuOpen={mobileMenuOpen}
          overflowMenuActive={overflowMenuActive}
          productCopy={productCopy}
          searchLink={searchLink}
          secondaryNavLayout={secondaryNavLayout}
          shouldRenderOverflowMenuButton={shouldRenderOverflowMenuButton}
          showSearchLink={showSearchLink}
          toggleMobileMenu={toggleMobileMenu}
        />
      </nav>
      <HiddenSecondaryNavigationMeasurement
        measurementRef={measurementRef}
        productCopy={productCopy}
        searchLink={searchLink}
        secondaryLinks={buildSecondaryLinks(productCopy)}
      />
    </div>
  );
}

function SecondaryNavigationLinks({
  activeSecondaryTab,
  closeMobileMenu,
  secondaryLinks,
}: {
  activeSecondaryTab: ReturnType<typeof resolveSecondaryNavId>;
  closeMobileMenu: () => void;
  secondaryLinks: SecondaryNavLink[];
}): JSX.Element | null {
  if (secondaryLinks.length === 0) {
    return null;
  }

  return (
    <>
      {secondaryLinks.map((link) => (
        <Link
          key={link.href}
          className={getNavPillClassName(activeSecondaryTab === link.id, false)}
          href={link.href}
          onClick={closeMobileMenu}
          prefetch={false}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

function NavigationUtilityButtons({
  activeSecondaryTab,
  closeMobileMenu,
  isPhoneViewport,
  mobileMenuOpen,
  overflowMenuActive,
  productCopy,
  searchLink,
  secondaryNavLayout,
  shouldRenderOverflowMenuButton,
  showSearchLink,
  toggleMobileMenu,
}: {
  activeSecondaryTab: ReturnType<typeof resolveSecondaryNavId>;
  closeMobileMenu: () => void;
  isPhoneViewport: boolean;
  mobileMenuOpen: boolean;
  overflowMenuActive: boolean;
  productCopy: ReturnType<typeof getProductCopy>;
  searchLink: ReturnType<typeof buildSearchLink>;
  secondaryNavLayout: SecondaryNavLayout;
  shouldRenderOverflowMenuButton: boolean;
  showSearchLink: boolean;
  toggleMobileMenu: () => void;
}): JSX.Element {
  return (
    <>
      {showSearchLink ? (
        <Link
          aria-label={productCopy.siteHeader.searchLabel}
          className={getIconNavPillClassName(activeSecondaryTab === searchLink.id, isPhoneViewport)}
          href={searchLink.href}
          onClick={closeMobileMenu}
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
            secondaryNavLayout === "full"
              ? productCopy.siteHeader.officialLinksLabel
              : productCopy.siteHeader.mobileMenuLabel
          }
          className={getIconNavPillClassName(
            mobileMenuOpen || overflowMenuActive,
            isPhoneViewport,
          )}
          onClick={toggleMobileMenu}
          type="button"
        >
          <MenuIcon />
        </button>
      ) : null}
    </>
  );
}

function HiddenSecondaryNavigationMeasurement({
  measurementRef,
  productCopy,
  searchLink,
  secondaryLinks,
}: {
  measurementRef: MutableRefObject<HTMLDivElement | null>;
  productCopy: ReturnType<typeof getProductCopy>;
  searchLink: ReturnType<typeof buildSearchLink>;
  secondaryLinks: SecondaryNavLink[];
}): JSX.Element {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed -left-[10000px] top-0 -z-10 flex items-center gap-2 opacity-0"
      ref={measurementRef}
    >
      {secondaryLinks.map((link) => (
        <span
          key={link.id}
          className={getNavPillClassName(false, false)}
          data-measure-id={link.id}
        >
          {link.label}
        </span>
      ))}
      <span
        className={getIconNavPillClassName(false, false)}
        data-measure-id={searchLink.id}
        title={searchLink.label}
      >
        <SearchIcon />
      </span>
      <span
        className={getIconNavPillClassName(false, false)}
        data-measure-id="overflowMenu"
        title={productCopy.siteHeader.officialLinksLabel}
      >
        <MenuIcon />
      </span>
    </div>
  );
}

function getNavPillClassName(active: boolean, isPhoneViewport: boolean): string {
  return [
    "nav-pill inline-flex items-center justify-center rounded-full px-3 py-2 font-medium transition",
    isPhoneViewport ? "min-w-0 flex-1 px-2 py-1.5 text-[0.82rem]" : "shrink-0 text-[0.95rem]",
    active
      ? "bg-accent text-accent-contrast shadow-[0_10px_24px_rgba(21,71,58,0.22)]"
      : "text-muted/92 hover:bg-surface-elevated hover:text-foreground",
  ].join(" ");
}

function getIconNavPillClassName(active: boolean, isPhoneViewport: boolean): string {
  return [
    "nav-pill inline-flex h-10 w-10 items-center justify-center rounded-full transition",
    isPhoneViewport ? "h-9 w-9 shrink-0" : "",
    active
      ? "bg-accent text-accent-contrast shadow-[0_10px_24px_rgba(21,71,58,0.22)]"
      : "text-muted/92 hover:bg-surface-elevated hover:text-foreground",
  ].join(" ");
}

function useMeasuredSecondaryNavWidths({
  measurementRef,
  setOverflowMenuWidth,
  setSecondaryNavCandidateWidths,
}: {
  measurementRef: MutableRefObject<HTMLDivElement | null>;
  setOverflowMenuWidth: Dispatch<SetStateAction<number>>;
  setSecondaryNavCandidateWidths: Dispatch<
    SetStateAction<Record<SecondaryNavVisibilityCandidateId, number>>
  >;
}): void {
  useLayoutEffect(() => {
    const measurementElement = measurementRef.current;
    if (measurementElement === null) {
      return undefined;
    }

    const currentMeasurementElement = measurementElement;

    function syncMeasurements(): void {
      const nextCandidateWidths = extractSecondaryNavCandidateWidths(currentMeasurementElement);
      const nextOverflowMenuWidth = extractMeasurementWidth(
        currentMeasurementElement,
        "overflowMenu",
      );

      setSecondaryNavCandidateWidths((current) =>
        areSecondaryNavCandidateWidthsEqual(current, nextCandidateWidths)
          ? current
          : nextCandidateWidths,
      );
      setOverflowMenuWidth((current) =>
        current === nextOverflowMenuWidth ? current : nextOverflowMenuWidth,
      );
    }

    syncMeasurements();

    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      syncMeasurements();
    });
    observer.observe(currentMeasurementElement);
    Array.from(currentMeasurementElement.children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      observer.disconnect();
    };
  }, [measurementRef, setOverflowMenuWidth, setSecondaryNavCandidateWidths]);
}

function extractMeasurementWidth(
  measurementElement: HTMLDivElement,
  measureId: SecondaryNavVisibilityCandidateId | "overflowMenu",
): number {
  const measuredElement = measurementElement.querySelector<HTMLElement>(
    `[data-measure-id="${measureId}"]`,
  );

  return measuredElement === null ? 0 : Math.round(measuredElement.getBoundingClientRect().width);
}

function extractSecondaryNavCandidateWidths(
  measurementElement: HTMLDivElement,
): Record<SecondaryNavVisibilityCandidateId, number> {
  return SECONDARY_NAV_VISIBILITY_ORDER.reduce<Record<SecondaryNavVisibilityCandidateId, number>>(
    (widths, candidateId) => {
      widths[candidateId] = extractMeasurementWidth(measurementElement, candidateId);

      return widths;
    },
    { ...EMPTY_SECONDARY_NAV_WIDTHS },
  );
}

function areSecondaryNavCandidateWidthsEqual(
  left: Record<SecondaryNavVisibilityCandidateId, number>,
  right: Record<SecondaryNavVisibilityCandidateId, number>,
): boolean {
  return SECONDARY_NAV_VISIBILITY_ORDER.every(
    (candidateId) => left[candidateId] === right[candidateId],
  );
}

function SearchIcon(): JSX.Element {
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

function MenuIcon(): JSX.Element {
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
