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

const PRIMARY_NAV_INDEX = new Map(PRIMARY_NAV_ITEMS.map((item, index) => [item.id, index]));
const SWIPE_THRESHOLD = 36;

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
  if (pathname.startsWith("/connect-ai")) {
    return "connectAi";
  }

  if (pathname.startsWith("/registration")) {
    return "registration";
  }

  if (pathname.startsWith("/settings") || pathname.startsWith("/planner/settings")) {
    return "settings";
  }

  if (pathname.startsWith("/search")) {
    return "search";
  }

  if (pathname.startsWith("/project") || pathname.startsWith("/community")) {
    return "project";
  }

  if (pathname.startsWith("/map") || pathname.startsWith("/mapa")) {
    return "map";
  }

  return null;
}

export function resolveSwipeNavigation(
  pathname: string,
  deltaX: number,
  preference: NavSwipePreference,
): { href: string; preferenceToPersist: Exclude<NavSwipePreference, null> | null } | null {
  if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
    return null;
  }

  const currentId = resolvePrimaryNavId(pathname);
  if (currentId === null) {
    return null;
  }
  const currentIndex = PRIMARY_NAV_INDEX.get(currentId);

  if (currentIndex === undefined) {
    return null;
  }

  if (preference === null && currentId === "planner") {
    return {
      href: "/",
      preferenceToPersist: deltaX > 0 ? "natural" : "inverted",
    };
  }

  const effectivePreference = preference ?? "natural";
  const direction = deltaX > 0 ? "right" : "left";
  const nextIndex =
    effectivePreference === "natural"
      ? direction === "right"
        ? currentIndex - 1
        : currentIndex + 1
      : direction === "right"
        ? currentIndex + 1
        : currentIndex - 1;

  const nextItem = PRIMARY_NAV_ITEMS[nextIndex];

  if (!nextItem) {
    return null;
  }

  return {
    href: nextItem.href,
    preferenceToPersist: null,
  };
}
