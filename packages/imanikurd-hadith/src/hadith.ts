import { loadData } from "./loadData.js";
import type { Hadith } from "./types.js";

let hadithCache: Hadith[] | null = null;

function getHadithData(): Hadith[] {
  if (!hadithCache) {
    hadithCache = loadData<Hadith[]>("hadiths.json");
  }
  return hadithCache;
}

/** Get all hadiths (Kurdish translations) */
export function getHadiths(): Hadith[] {
  return getHadithData();
}

/** Get a single hadith by id */
export function getHadith(id: number): Hadith | undefined {
  return getHadithData().find((h) => h.id === id);
}

/** Search hadiths by title, Arabic, or Kurdish text */
export function searchHadiths(query: string): Hadith[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getHadithData().filter(
    (h) =>
      h.title.toLowerCase().includes(normalized) ||
      h.kurdish.toLowerCase().includes(normalized) ||
      h.arabic.includes(query.trim())
  );
}

/** Get total hadith count */
export function getHadithCount(): number {
  return getHadithData().length;
}

export type { Hadith };
