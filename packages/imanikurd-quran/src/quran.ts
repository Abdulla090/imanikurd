import { loadData } from "./loadData.js";
import type { Ayah, AyahWithTafsir, QuranData, Surah } from "./types.js";

let quranCache: QuranData | null = null;

function getQuranData(): QuranData {
  if (!quranCache) {
    quranCache = loadData<QuranData>("quran.json");
  }
  return quranCache;
}

/** Get Quran metadata (total surahs, total ayahs, source) */
export function getQuranMetadata() {
  return getQuranData().metadata;
}

/** Get all 114 surahs with metadata */
export function getSurahs(): Surah[] {
  return getQuranData().surahs;
}

/** Get a single surah by number (1-114) */
export function getSurah(surahNumber: number): Surah | undefined {
  return getQuranData().surahs.find((s) => s.number === surahNumber);
}

/** Get all ayahs for a surah */
export function getSurahAyahs(surahNumber: number): Ayah[] {
  return getQuranData().ayahs.filter((a) => a.surah === surahNumber);
}

/** Get a single ayah by surah and ayah number */
export function getAyah(surahNumber: number, ayahNumber: number): Ayah | undefined {
  return getQuranData().ayahs.find(
    (a) => a.surah === surahNumber && a.ayah === ayahNumber
  );
}

/** Get the complete Quran — all 6236 ayahs */
export function getFullQuran(): Ayah[] {
  return getQuranData().ayahs;
}

/** Get all ayahs in a specific juz (1-30) */
export function getJuzAyahs(juzNumber: number): Ayah[] {
  return getQuranData().ayahs.filter((a) => a.juz === juzNumber);
}

/** Get all ayahs on a specific mushaf page (1-604) */
export function getPageAyahs(pageNumber: number): Ayah[] {
  return getQuranData().ayahs.filter((a) => a.page === pageNumber);
}

/** Search Quran Arabic text (case-insensitive substring match) */
export function searchQuran(query: string): Ayah[] {
  const normalized = query.trim();
  if (!normalized) return [];

  return getQuranData().ayahs.filter((a) => a.text.includes(normalized));
}

/** Get total ayah count (should be 6236) */
export function getTotalAyahCount(): number {
  return getQuranData().ayahs.length;
}

/** Attach tafsir text to ayahs */
export function attachTafsir(ayahs: Ayah[], tafsirMap: Record<number, string>): AyahWithTafsir[] {
  return ayahs.map((a) => ({
    ...a,
    tafsir: tafsirMap[a.ayah],
  }));
}

export type { Ayah, AyahWithTafsir, QuranData, Surah };
