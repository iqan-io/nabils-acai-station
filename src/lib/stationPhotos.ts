import { menuSectionGallery, menuSectionImage, type ProductImage } from "@/lib/productImages";

/*
  The photographs the menu shows: exactly the ones the live site's menu used.

  2026-09-23: for one round the menu showed in-shop photographs instead (a crêpe
  tray held up against the mascot wall, cans on the counter), chosen because
  the reference's menu photographs are dishes shot where they are served. Ali
  asked for the menu to use the same images the original site used, so this
  maps every section straight back to the registry the live menu reads:
  `menuSectionImage` for the section photograph and `menuSectionGallery` for
  the açaí build strip. No new photograph is introduced here.

  Matcha, Iced Lattes and Milkshakes have no photograph on the live site
  either; the menu keeps the previous section's photograph up while they are
  on screen rather than inventing one.
*/

export type StationPhoto = { src: string; alt: string };

export function stationPhotoFor(title: string): StationPhoto | undefined {
  const studio = menuSectionImage(title);
  return studio ? { src: studio.src, alt: studio.alt } : undefined;
}

export function stationGalleryFor(title: string): readonly ProductImage[] {
  return menuSectionGallery(title);
}
