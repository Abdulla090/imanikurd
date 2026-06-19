import { describe, it, expect } from "vitest";
import {
  getHadiths,
  getHadith,
  searchHadiths,
  getHadithCount,
  getHadithsAsync,
  getHadithAsync,
  searchHadithsAsync,
  getHadithCountAsync,
} from "../index.js";

describe("Hadith Service", () => {
  it("should get all hadiths", () => {
    const hadiths = getHadiths();
    expect(hadiths.length).toBeGreaterThan(0);
  });

  it("should get all hadiths asynchronously", async () => {
    const hadiths = await getHadithsAsync();
    expect(hadiths.length).toBeGreaterThan(0);
  });

  it("should get a single hadith by id", () => {
    const hadith = getHadith(1);
    expect(hadith).toBeDefined();
    expect(hadith?.id).toBe(1);
  });

  it("should get a single hadith by id asynchronously", async () => {
    const hadith = await getHadithAsync(1);
    expect(hadith).toBeDefined();
    expect(hadith?.id).toBe(1);
  });

  it("should search hadiths by keyword", () => {
    const matches = searchHadiths("پێغەمبەر");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("should search hadiths asynchronously", async () => {
    const matches = await searchHadithsAsync("پێغەمبەر");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("should get correct hadith count", () => {
    const count = getHadithCount();
    expect(count).toBeGreaterThan(0);
    expect(getHadiths().length).toBe(count);
  });

  it("should get correct hadith count asynchronously", async () => {
    const count = await getHadithCountAsync();
    expect(count).toBeGreaterThan(0);
  });
});
