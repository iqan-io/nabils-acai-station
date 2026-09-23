import { StationNav } from "@/components/home-cinematic/StationNav";

/*
  One bar for the whole site.

  This used to hold a second navbar — a cream sticky bar with a small logo,
  underlined uppercase links and a filled honey "Order" button — that rendered
  on every route except `/`, where it delegated to `StationNav`. That delegation
  is why the redesign appeared to evaporate one click off the homepage: the
  reference bar (large logo over the panel, circled ORDER, outlined
  "Desserts & drinks") existed only on `/`, and the other five routes still
  opened with the pre-redesign bar over a cream page.

  `StationNav` is path-aware now, so there is nothing left to choose between and
  this file is a single re-export. It stays as a file rather than being deleted
  because `layout.tsx` and the e2e suite both address the site's navigation as
  `Navbar`, and one indirection is cheaper than renaming that contract.
*/
export function Navbar() {
  return <StationNav />;
}
