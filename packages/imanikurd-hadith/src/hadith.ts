import { loadData, loadDataAsync } from "./loadData.js";
import type { Hadith } from "./types.js";

let hadithCache: Hadith[] | null = null;

function getHadithData(): Hadith[] {
  if (!hadithCache) {
    hadithCache = loadData<Hadith[]>("hadiths.json");
  }
  return hadithCache;
}

async function getHadithDataAsync(): Promise<Hadith[]> {
  if (!hadithCache) {
    hadithCache = await loadDataAsync<Hadith[]>("hadiths.json");
  }
  return hadithCache;
}

/** Get all hadiths (Kurdish translations) */
export function getHadiths(): Hadith[] {
  return getHadithData();
}

/** Get all hadiths asynchronously */
export async function getHadithsAsync(): Promise<Hadith[]> {
  return getHadithDataAsync();
}

/** Get a single hadith by id */
export function getHadith(id: number): Hadith | undefined {
  return getHadithData().find((h) => h.id === id);
}

/** Get a single hadith by id asynchronously */
export async function getHadithAsync(id: number): Promise<Hadith | undefined> {
  const data = await getHadithDataAsync();
  return data.find((h) => h.id === id);
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

/** Search hadiths asynchronously by title, Arabic, or Kurdish text */
export async function searchHadithsAsync(query: string): Promise<Hadith[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const data = await getHadithDataAsync();
  return data.filter(
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

/** Get total hadith count asynchronously */
export async function getHadithCountAsync(): Promise<number> {
  const data = await getHadithDataAsync();
  return data.length;
}

export type { Hadith };

