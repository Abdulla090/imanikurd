import { loadData, loadDataAsync } from "./loadData.js";

export interface SeerahEntry {
  id: number;
  periodId: number;
  periodName: string;
  title: string;
  titleArabic: string;
  date: string;
  hijriDate: string;
  content: string; // mapped from description
  importance?: string;
}

interface RawPeriod {
  id: number;
  period: string;
  periodArabic: string;
  events: Array<{
    id: number;
    title: string;
    titleArabic: string;
    date: string;
    hijriDate: string;
    description: string;
    importance?: string;
  }>;
}

let seerahCache: SeerahEntry[] | null = null;

function flattenPeriods(periods: RawPeriod[]): SeerahEntry[] {
  const list: SeerahEntry[] = [];
  for (const p of periods) {
    if (!p.events) continue;
    for (const e of p.events) {
      list.push({
        id: e.id,
        periodId: p.id,
        periodName: p.period,
        title: e.title,
        titleArabic: e.titleArabic,
        date: e.date,
        hijriDate: e.hijriDate,
        content: e.description || "",
        importance: e.importance,
      });
    }
  }
  return list;
}

function getSeerahData(): SeerahEntry[] {
  if (!seerahCache) {
    const raw = loadData<RawPeriod[]>("seerah.json");
    seerahCache = flattenPeriods(raw);
  }
  return seerahCache;
}

async function getSeerahDataAsync(): Promise<SeerahEntry[]> {
  if (!seerahCache) {
    const raw = await loadDataAsync<RawPeriod[]>("seerah.json");
    seerahCache = flattenPeriods(raw);
  }
  return seerahCache;
}

/** Get Seerah (Prophet Muhammad biography) entries */
export function getSeerah(): SeerahEntry[] {
  return getSeerahData();
}

/** Get Seerah (Prophet Muhammad biography) entries asynchronously */
export async function getSeerahAsync(): Promise<SeerahEntry[]> {
  return getSeerahDataAsync();
}

/** Get a single Seerah entry by id */
export function getSeerahEntry(id: number): SeerahEntry | undefined {
  return getSeerahData().find((s) => s.id === id);
}

/** Get a single Seerah entry by id asynchronously */
export async function getSeerahEntryAsync(id: number): Promise<SeerahEntry | undefined> {
  const data = await getSeerahDataAsync();
  return data.find((s) => s.id === id);
}

/** Search Seerah content */
export function searchSeerah(query: string): SeerahEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getSeerahData().filter(
    (s) =>
      s.title.toLowerCase().includes(normalized) ||
      s.content.toLowerCase().includes(normalized)
  );
}

/** Search Seerah content asynchronously */
export async function searchSeerahAsync(query: string): Promise<SeerahEntry[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const data = await getSeerahDataAsync();
  return data.filter(
    (s) =>
      s.title.toLowerCase().includes(normalized) ||
      s.content.toLowerCase().includes(normalized)
  );
}
