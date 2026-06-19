import { describe, it, expect } from "vitest";
import {
  getSurahs,
  getSurah,
  getSurahAyahs,
  getAyah,
  getFullQuran,
  getJuzAyahs,
  getPageAyahs,
  searchQuran,
  getTotalAyahCount,
  getTafsirOptions,
  getTafsir,
  getTafsirForAyah,
  getTafsirForSurah,
  searchTafsir,
  getSurahsAsync,
  getTafsirAsync,
} from "../index.js";

describe("Quran and Tafsir Services", () => {
  it("should load 114 surahs", () => {
    const surahs = getSurahs();
    expect(surahs.length).toBe(114);
    expect(surahs[0].englishName).toBe("Al-Fatiha");
    expect(surahs[113].englishName).toBe("An-Nas");
  });

  it("should load 114 surahs asynchronously", async () => {
    const surahs = await getSurahsAsync();
    expect(surahs.length).toBe(114);
  });

  it("should load single surah info", () => {
    const surah = getSurah(1); // Al-Fatiha
    expect(surah).toBeDefined();
    expect(surah?.englishName).toBe("Al-Fatiha");
  });

  it("should get surah ayahs", () => {
    const ayahs = getSurahAyahs(1); // Fatiha has 7 ayahs
    expect(ayahs.length).toBe(7);
    expect(ayahs[0].surah).toBe(1);
    expect(ayahs[0].ayah).toBe(1);
  });

  it("should get specific ayah", () => {
    const ayah = getAyah(2, 255); // Ayat al-Kursi
    expect(ayah).toBeDefined();
    expect(ayah?.ayah).toBe(255);
    expect(ayah?.surah).toBe(2);
  });

  it("should retrieve full quran (6236 ayahs)", () => {
    expect(getTotalAyahCount()).toBe(6236);
    const quran = getFullQuran();
    expect(quran.length).toBe(6236);
  });

  it("should filter ayahs by juz", () => {
    const juz1 = getJuzAyahs(1);
    expect(juz1.length).toBeGreaterThan(0);
    expect(juz1[0].juz).toBe(1);
  });

  it("should filter ayahs by mushaf page", () => {
    const page1 = getPageAyahs(1);
    expect(page1.length).toBe(7); // Al-Fatiha is on page 1 (7 ayahs)
  });

  it("should search Quran text", () => {
    const matches = searchQuran("بِسۡمِ");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("should search Quran text asynchronously", async () => {
    const { searchQuranAsync } = await import("../index.js");
    const matches = await searchQuranAsync("بِسۡمِ");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("should list available Tafsirs", () => {
    const options = getTafsirOptions();
    expect(options.length).toBe(13);
    expect(options.find((o) => o.id === "rebar")).toBeDefined();
  });

  it("should load Tafsir dataset", () => {
    const tafsir = getTafsir("rebar");
    expect(tafsir.length).toBe(6236);
    expect(tafsir[0].t).toBeDefined();
  });

  it("should load Tafsir dataset asynchronously", async () => {
    const tafsir = await getTafsirAsync("rebar");
    expect(tafsir.length).toBe(6236);
  });

  it("should get tafsir for single ayah", () => {
    const text = getTafsirForAyah("rebar", 1, 1);
    expect(text).toBeDefined();
    expect(typeof text).toBe("string");
  });

  it("should get all tafsir for a surah", () => {
    const mapping = getTafsirForSurah("rebar", 1);
    expect(Object.keys(mapping).length).toBe(7);
    expect(mapping[1]).toBeDefined();
  });

  it("should search inside a Tafsir text", () => {
    const matches = searchTafsir("rebar", "خوا");
    expect(matches.length).toBeGreaterThan(0);
  });
});
