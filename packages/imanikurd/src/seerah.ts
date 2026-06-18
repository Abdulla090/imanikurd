import { loadData } from "./loadData.js";

export interface SeerahEntry {
  id: number;
  title: string;
  content: string;
  [key: string]: unknown;
}

let seerahCache: SeerahEntry[] | null = null;

function getSeerahData(): SeerahEntry[] {
  if (!seerahCache) {
    seerahCache = loadData<SeerahEntry[]>("seerah.json");
  }
  return seerahCache;
}

/** Get Seerah (Prophet Muhammad biography) entries */
export function getSeerah(): SeerahEntry[] {
  return getSeerahData();
}

/** Get a single Seerah entry by id */
export function getSeerahEntry(id: number): SeerahEntry | undefined {
  return getSeerahData().find((s) => s.id === id);
}

/** Search Seerah content */
export function searchSeerah(query: string): SeerahEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getSeerahData().filter(
    (s) =>
      String(s.title || "").toLowerCase().includes(normalized) ||
      String(s.content || "").toLowerCase().includes(normalized)
  );
}

