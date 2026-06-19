import { loadData } from "./loadData.js";
import type { TafsirEntry, TafsirOption } from "./types.js";

/** All 13 Kurdish Tafsir options available in the package */
export const TAFSIR_OPTIONS: TafsirOption[] = [
  { id: "rebar", name: "تەفسیری ڕێبەر", file: "tafsir_rebar.json" },
  { id: "asan", name: "تەفسیری ئاسان", file: "tafsir_asan.json" },
  { id: "puxta", name: "تەفسیری پوختە", file: "tafsir_puxta.json" },
  { id: "raman", name: "تەفسیری ڕامان", file: "tafsir_raman.json" },
  { id: "hazhar", name: "تەفسیری هەژار (مامۆستا هەژار)", file: "tafsir_hazhar.json" },
  { id: "zhin", name: "تەفسیری ژیان", file: "tafsir_zhin.json" },
  { id: "sanahi", name: "تەفسیری سەناهی", file: "tafsir_sanahi.json" },
  { id: "maisar", name: "تەفسیری مویەسەر", file: "tafsir_maisar.json" },
  { id: "tawhid", name: "تەفسیری تەوحیدی", file: "tafsir_tawhid.json" },
  { id: "roshn", name: "تەفسیری ڕۆشن", file: "tafsir_roshn.json" },
  { id: "runahi", name: "تەفسیری ڕوناهی", file: "tafsir_runahi.json" },
  { id: "mokhtasar", name: "تەفسیری موختەسەر", file: "tafsir_mokhtasar.json" },
  { id: "krd", name: "تەفسیری کوردی", file: "tafsir_krd.json" },
];

const tafsirCache = new Map<string, TafsirEntry[]>();

function normalizeEntry(item: { s: number | string; a: number; t: string }): TafsirEntry {
  return {
    s: typeof item.s === "string" ? parseInt(item.s, 10) : item.s,
    a: item.a,
    t: item.t,
  };
}

function getTafsirFile(tafsirId: string): string {
  const option = TAFSIR_OPTIONS.find((t) => t.id === tafsirId);
  if (!option) {
    throw new Error(
      `Unknown tafsir id "${tafsirId}". Valid ids: ${TAFSIR_OPTIONS.map((t) => t.id).join(", ")}`
    );
  }
  return option.file;
}

function loadTafsirRaw(tafsirId: string): TafsirEntry[] {
  if (tafsirCache.has(tafsirId)) {
    return tafsirCache.get(tafsirId)!;
  }

  const file = getTafsirFile(tafsirId);
  const raw = loadData<Array<{ s: number | string; a: number; t: string }>>(file);
  const entries = raw.map(normalizeEntry);
  tafsirCache.set(tafsirId, entries);
  return entries;
}

/** Get list of available Tafsir options */
export function getTafsirOptions(): TafsirOption[] {
  return TAFSIR_OPTIONS;
}

/** Get full tafsir dataset for a given tafsir id */
export function getTafsir(tafsirId: string): TafsirEntry[] {
  return loadTafsirRaw(tafsirId);
}

/** Get tafsir text for a specific ayah */
export function getTafsirForAyah(
  tafsirId: string,
  surahNumber: number,
  ayahNumber: number
): string | undefined {
  const entries = loadTafsirRaw(tafsirId);
  const entry = entries.find((e) => e.s === surahNumber && e.a === ayahNumber);
  return entry?.t;
}

/** Get-get all tafsir entries for a surah as a map of ayah number -> text */
export function getTafsirForSurah(
  tafsirId: string,
  surahNumber: number
): Record<number, string> {
  const entries = loadTafsirRaw(tafsirId);
  const result: Record<number, string> = {};

  for (const entry of entries) {
    if (entry.s === surahNumber) {
      result[entry.a] = entry.t;
    }
  }

  return result;
}

/** Search tafsir text across all entries of a given tafsir */
export function searchTafsir(tafsirId: string, query: string): TafsirEntry[] {
  const normalized = query.trim();
  if (!normalized) return [];

  return loadTafsirRaw(tafsirId).filter((e) => e.t.includes(normalized));
}

export type { TafsirEntry, TafsirOption };
