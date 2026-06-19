import { loadData, loadDataAsync } from "./loadData.js";
import type { Ayah, AyahWithTafsir, QuranData, Surah } from "./types.js";

let quranCache: QuranData | null = null;

function getQuranData(): QuranData {
  if (!quranCache) {
    quranCache = loadData<QuranData>("quran.json");
  }
  return quranCache;
}

async function getQuranDataAsync(): Promise<QuranData> {
  if (!quranCache) {
    quranCache = await loadDataAsync<QuranData>("quran.json");
  }
  return quranCache;
}

/** Get Quran metadata (total surahs, total ayahs, source) */
export function getQuranMetadata() {
  return getQuranData().metadata;
}

/** Get Quran metadata asynchronously */
export async function getQuranMetadataAsync() {
  const data = await getQuranDataAsync();
  return data.metadata;
}

/** Get all 114 surahs with metadata */
export function getSurahs(): Surah[] {
  return getQuranData().surahs;
}

/** Get all 114 surahs asynchronously */
export async function getSurahsAsync(): Promise<Surah[]> {
  const data = await getQuranDataAsync();
  return data.surahs;
}

/** Get a single surah by number (1-114) */
export function getSurah(surahNumber: number): Surah | undefined {
  return getQuranData().surahs.find((s) => s.number === surahNumber);
}

/** Get a single surah asynchronously by number (1-114) */
export async function getSurahAsync(surahNumber: number): Promise<Surah | undefined> {
  const surahs = await getSurahsAsync();
  return surahs.find((s) => s.number === surahNumber);
}

/** Get all ayahs for a surah */
export function getSurahAyahs(surahNumber: number): Ayah[] {
  return getQuranData().ayahs.filter((a) => a.surah === surahNumber);
}

/** Get all ayahs for a surah asynchronously */
export async function getSurahAyahsAsync(surahNumber: number): Promise<Ayah[]> {
  const data = await getQuranDataAsync();
  return data.ayahs.filter((a) => a.surah === surahNumber);
}

/** Get a single ayah by surah and ayah number */
export function getAyah(surahNumber: number, ayahNumber: number): Ayah | undefined {
  return getQuranData().ayahs.find(
    (a) => a.surah === surahNumber && a.ayah === ayahNumber
  );
}

/** Get a single ayah asynchronously by surah and ayah number */
export async function getAyahAsync(surahNumber: number, ayahNumber: number): Promise<Ayah | undefined> {
  const data = await getQuranDataAsync();
  return data.ayahs.find(
    (a) => a.surah === surahNumber && a.ayah === ayahNumber
  );
}

/** Get the complete Quran — all 6236 ayahs */
export function getFullQuran(): Ayah[] {
  return getQuranData().ayahs;
}

/** Get the complete Quran asynchronously */
export async function getFullQuranAsync(): Promise<Ayah[]> {
  const data = await getQuranDataAsync();
  return data.ayahs;
}

/** Get all ayahs in a specific juz (1-30) */
export function getJuzAyahs(juzNumber: number): Ayah[] {
  return getQuranData().ayahs.filter((a) => a.juz === juzNumber);
}

/** Get all ayahs in a specific juz asynchronously */
export async function getJuzAyahsAsync(juzNumber: number): Promise<Ayah[]> {
  const data = await getQuranDataAsync();
  return data.ayahs.filter((a) => a.juz === juzNumber);
}

/** Get all ayahs on a specific mushaf page (1-604) */
export function getPageAyahs(pageNumber: number): Ayah[] {
  return getQuranData().ayahs.filter((a) => a.page === pageNumber);
}

/** Get all ayahs on a specific mushaf page asynchronously */
export async function getPageAyahsAsync(pageNumber: number): Promise<Ayah[]> {
  const data = await getQuranDataAsync();
  return data.ayahs.filter((a) => a.page === pageNumber);
}

/** Search Quran Arabic text (case-insensitive substring match) */
export function searchQuran(query: string): Ayah[] {
  const normalized = query.trim();
  if (!normalized) return [];

  return getQuranData().ayahs.filter((a) => a.text.includes(normalized));
}

/** Search Quran Arabic text asynchronously */
export async function searchQuranAsync(query: string): Promise<Ayah[]> {
  const normalized = query.trim();
  if (!normalized) return [];

  const data = await getQuranDataAsync();
  return data.ayahs.filter((a) => a.text.includes(normalized));
}

/** Get total ayah count (should be 6236) */
export function getTotalAyahCount(): number {
  return getQuranData().ayahs.length;
}

/** Get total ayah count asynchronously */
export async function getTotalAyahCountAsync(): Promise<number> {
  const data = await getQuranDataAsync();
  return data.ayahs.length;
}

/** Attach tafsir text to ayahs */
export function attachTafsir(ayahs: Ayah[], tafsirMap: Record<number, string>): AyahWithTafsir[] {
  return ayahs.map((a) => ({
    ...a,
    tafsir: tafsirMap[a.ayah],
  }));
}

export type { Ayah, AyahWithTafsir, QuranData, Surah };

