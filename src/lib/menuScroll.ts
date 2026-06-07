// The menu page renders each section twice — a desktop copy (with `id`) and a
// mobile copy (with `data-anchor`) — and only one is visible per viewport. These
// helpers always resolve to the on-screen copy so links land on the real
// section instead of the hidden duplicate (which sits at the top of the page).

export function visibleMenuSection(slug: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const matches = document.querySelectorAll<HTMLElement>(
    `#${CSS.escape(slug)}, [data-anchor="${slug}"]`,
  );
  return Array.from(matches).find((el) => el.offsetParent !== null) ?? null;
}

export function scrollToMenuSection(slug: string): boolean {
  const el = visibleMenuSection(slug);
  if (!el) return false;
  // scrollIntoView honours the section's scroll-mt, clearing the sticky bars.
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function slugFromHref(href: string): string {
  const hash = href.split("#")[1] ?? "";
  return decodeURIComponent(hash);
}
