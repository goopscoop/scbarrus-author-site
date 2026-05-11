import type { ImageMetadata } from 'astro';

/** Filename (as in `Book.img`) → Astro image metadata for covers in `src/assets/`. */
export const coverByFilename = (() => {
  const map: Record<string, ImageMetadata> = {};
  const modules = import.meta.glob<{ default: ImageMetadata }>(
    '../assets/*.{jpg,jpeg,png,webp}',
    { eager: true },
  );
  for (const path of Object.keys(modules)) {
    const file = path.split('/').pop() ?? path;
    const mod = modules[path];
    if (mod?.default) {
      map[file] = mod.default;
    }
  }
  return map;
})();
