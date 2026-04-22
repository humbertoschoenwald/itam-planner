import type { NavSwipePreference } from "@/stores/planner-ui-store";

export const PRIMARY_NAV_ITEMS = [
  { href: "/", id: "home" },
  { href: "/planner", id: "planner" },
  { href: "/calendar", id: "calendar" },
] as const;

export type PrimaryNavId = (typeof PRIMARY_NAV_ITEMS)[number]["id"];
export const SECONDARY_NAV_ITEMS = [
  { href: "/project", id: "project" },
  { href: "/connect-ai", id: "connectAi" },
  { href: "/registration", id: "registration" },
  { href: "/settings", id: "settings" },
  { href: "/search", id: "search" },
  { href: "/map", id: "map" },
] as const;

export type SecondaryNavId = (typeof SECONDARY_NAV_ITEMS)[number]["id"];
export const VISIBLE_SECONDARY_NAV_LINK_IDS = [
  "project",
  "connectAi",
  "registration",
  "settings",
] as const;
export const SECONDARY_NAV_VISIBILITY_ORDER = [
  "project",
  "connectAi",
  "search",
  "registration",
  "settings",
] as const;
export type VisibleSecondaryNavLinkId = (typeof VISIBLE_SECONDARY_NAV_LINK_IDS)[number];
export type SecondaryNavVisibilityCandidateId = (typeof SECONDARY_NAV_VISIBILITY_ORDER)[number];
export type SecondaryNavLayout = "compact" | "full" | "overflow";

const PRIMARY_NAV_INDEX = new Map(PRIMARY_NAV_ITEMS.map((item, index) => [item.id, index]));
const SECONDARY_NAV_ITEM_GAP_PX = 8;
const SWIPE_THRESHOLD = 36;
const SECONDARY_NAV_PREFIX_MATCHERS = [
  { id: "connectAi", prefixes: ["/connect-ai"] },
  { id: "registration", prefixes: ["/registration"] },
  { id: "settings", prefixes: ["/settings", "/planner/settings"] },
  { id: "search", prefixes: ["/search"] },
  { id: "project", prefixes: ["/project", "/community"] },
  { id: "map", prefixes: ["/map"] },
] as const satisfies readonly { id: SecondaryNavId; prefixes: readonly string[] }[];
const NAV_DIRECTION_OFFSETS = {
  natural: {
    left: 1,
    right: -1,
  },
  inverted: {
    left: -1,
    right: 1,
  },
} as const;

export function resolvePrimaryNavId(pathname: string): PrimaryNavId | null {
  if (pathname === "/") {
    return "home";
  }

  if (pathname.startsWith("/planner")) {
    return "planner";
  }

  if (pathname.startsWith("/calendar")) {
    return "calendar";
  }

  return null;
}

export function resolveSecondaryNavId(pathname: string): SecondaryNavId | null {
  return (
    SECONDARY_NAV_PREFIX_MATCHERS.find(({ prefixes }) =>
      prefixes.some((prefix) => pathname.startsWith(prefix)),
    )?.id ?? null
  );
}

export function resolveSwipeNavigation(
  pathname: string,
  deltaX: number,
  preference: NavSwipePreference,
): { href: string; preferenceToPersist: Exclude<NavSwipePreference, null> | null } | null {
  if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
    return null;
  }

  const swipeContext = getSwipeContext(pathname, deltaX);
  if (swipeContext === null) {
    return null;
  }

  const { currentId, currentIndex, direction } = swipeContext;
  if (preference === null && currentId === "planner") {
    return {
      href: "/",
      preferenceToPersist: deltaX > 0 ? "natural" : "inverted",
    };
  }

  const effectivePreference = preference ?? "natural";
  const nextIndex = currentIndex + NAV_DIRECTION_OFFSETS[effectivePreference][direction];
  const nextItem = PRIMARY_NAV_ITEMS[nextIndex];

  if (!nextItem) {
    return null;
  }

  return {
    href: nextItem.href,
    preferenceToPersist: null,
  };
}

export function resolveSecondaryNavPresentation({
  availableWidth,
  candidateWidths,
  isPhoneViewport,
  overflowMenuWidth,
}: {
  availableWidth: number;
  candidateWidths: Record<SecondaryNavVisibilityCandidateId, number>;
  isPhoneViewport: boolean;
  overflowMenuWidth: number;
}): {
  layout: SecondaryNavLayout;
  visibleCandidateIds: SecondaryNavVisibilityCandidateId[];
} {
  if (
    shouldCollapseSecondaryNav({
      availableWidth,
      candidateWidths,
      isPhoneViewport,
      overflowMenuWidth,
    })
  ) {
    return {
      layout: "overflow",
      visibleCandidateIds: [],
    };
  }

  let occupiedWidth = overflowMenuWidth;
  const visibleCandidateIds: SecondaryNavVisibilityCandidateId[] = [];

  for (const candidateId of SECONDARY_NAV_VISIBILITY_ORDER) {
    const nextOccupiedWidth =
      occupiedWidth + SECONDARY_NAV_ITEM_GAP_PX + candidateWidths[candidateId];

    if (nextOccupiedWidth > availableWidth) {
      continue;
    }

    visibleCandidateIds.push(candidateId);
    occupiedWidth = nextOccupiedWidth;
  }

  if (visibleCandidateIds.length === 0) {
    return {
      layout: "overflow",
      visibleCandidateIds: [],
    };
  }

  return {
    layout:
      visibleCandidateIds.length === SECONDARY_NAV_VISIBILITY_ORDER.length ? "full" : "compact",
    visibleCandidateIds,
  };
}

function shouldCollapseSecondaryNav({
  availableWidth,
  candidateWidths,
  isPhoneViewport,
  overflowMenuWidth,
}: {
  availableWidth: number;
  candidateWidths: Record<SecondaryNavVisibilityCandidateId, number>;
  isPhoneViewport: boolean;
  overflowMenuWidth: number;
}): boolean {
  return (
    isPhoneViewport ||
    availableWidth <= 0 ||
    overflowMenuWidth <= 0 ||
    hasUnmeasuredSecondaryNavCandidate(candidateWidths)
  );
}

function hasUnmeasuredSecondaryNavCandidate(
  candidateWidths: Record<SecondaryNavVisibilityCandidateId, number>,
): boolean {
  return SECONDARY_NAV_VISIBILITY_ORDER.some((candidateId) => candidateWidths[candidateId] <= 0);
}

function getSwipeContext(
  pathname: string,
  deltaX: number,
): { currentId: PrimaryNavId; currentIndex: number; direction: "left" | "right" } | null {
  const currentId = resolvePrimaryNavId(pathname);

  if (currentId === null) {
    return null;
  }

  const currentIndex = PRIMARY_NAV_INDEX.get(currentId);

  if (currentIndex === undefined) {
    return null;
  }

  return {
    currentId,
    currentIndex,
    direction: deltaX > 0 ? "right" : "left",
  };
}
