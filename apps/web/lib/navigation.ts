import type { NavSwipePreference } from "@/stores/planner-ui-store";

export const PRIMARY_NAV_ITEMS = [
  { href: "/", id: "home" },
  { href: "/planner", id: "planner" },
  { href: "/calendar", id: "calendar" },
] as const;

export type PrimaryNavId = (typeof PRIMARY_NAV_ITEMS)[number]["id"];

const PRIMARY_NAV_INDEX = new Map(PRIMARY_NAV_ITEMS.map((item, index) => [item.id, index]));
const SWIPE_THRESHOLD = 36;

export function resolvePrimaryNavId(pathname: string): PrimaryNavId {
  if (pathname.startsWith("/planner")) {
    return "planner";
  }

  if (pathname.startsWith("/calendar")) {
    return "calendar";
  }

  return "home";
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
