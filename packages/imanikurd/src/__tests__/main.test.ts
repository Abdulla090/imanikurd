import { describe, it, expect } from "vitest";
import {
  getDhikrCategories,
  getDhikrCategoriesAsync,
  getDhikrItems,
  getDhikrItemsAsync,
  getDhikrByCategory,
  getDhikrByCategoryAsync,
  getDhikrById,
  getDhikrByIdAsync,
  searchDhikr,
  searchDhikrAsync,
  getDhikrCategoryWithItems,
  getDhikrCategoryWithItemsAsync,
  getNamesOfAllah,
  getNamesOfAllahAsync,
  getNameOfAllah,
  getNameOfAllahAsync,
  searchNamesOfAllah,
  searchNamesOfAllahAsync,
  getCompanions,
  getCompanionsAsync,
  getCompanion,
  getCompanionAsync,
  searchCompanions,
  searchCompanionsAsync,
  getSeerah,
  getSeerahAsync,
  getSeerahEntry,
  getSeerahEntryAsync,
  searchSeerah,
  searchSeerahAsync,
  getLibrary,
  getLibraryAsync,
  getLibraryItem,
  getLibraryItemAsync,
  searchLibrary,
  searchLibraryAsync,
  setBaseUrl,
  setDataLoader,
} from "../index.js";

describe("Main Package Features (Dhikr, Names, Companions, Seerah, Library)", () => {
  // ── Dhikr ──
  describe("Dhikr", () => {
    it("should get categories", () => {
      const categories = getDhikrCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0].name).toBeDefined();
    });

    it("should get categories asynchronously", async () => {
      const categories = await getDhikrCategoriesAsync();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should get items", () => {
      const items = getDhikrItems();
      expect(items.length).toBeGreaterThan(0);
    });

    it("should get items asynchronously", async () => {
      const items = await getDhikrItemsAsync();
      expect(items.length).toBeGreaterThan(0);
    });

    it("should get items by category", () => {
      const items = getDhikrByCategory(1);
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].categoryId).toBe(1);
    });

    it("should get items by category asynchronously", async () => {
      const items = await getDhikrByCategoryAsync(1);
      expect(items.length).toBeGreaterThan(0);
    });

    it("should get single item by id", () => {
      const item = getDhikrById(1);
      expect(item).toBeDefined();
      expect(item?.id).toBe(1);
    });

    it("should get single item by id asynchronously", async () => {
      const item = await getDhikrByIdAsync(1);
      expect(item).toBeDefined();
      expect(item?.id).toBe(1);
    });

    it("should search dhikr text", () => {
      const matches = searchDhikr("الْحَمْدُ");
      expect(matches.length).toBeGreaterThan(0);
    });

    it("should search dhikr text asynchronously", async () => {
      const matches = await searchDhikrAsync("الْحَمْدُ");
      expect(matches.length).toBeGreaterThan(0);
    });

    it("should get category with items bundle", () => {
      const bundle = getDhikrCategoryWithItems(1);
      expect(bundle).not.toBeNull();
      expect(bundle?.category.id).toBe(1);
      expect(bundle?.items.length).toBeGreaterThan(0);
    });

    it("should get category with items bundle asynchronously", async () => {
      const bundle = await getDhikrCategoryWithItemsAsync(1);
      expect(bundle).not.toBeNull();
      expect(bundle?.category.id).toBe(1);
    });
  });

  // ── Names of Allah ──
  describe("Names of Allah", () => {
    it("should get all names", () => {
      const names = getNamesOfAllah();
      expect(names.length).toBe(99);
      expect(names[0].id).toBe(1);
    });

    it("should get all names asynchronously", async () => {
      const names = await getNamesOfAllahAsync();
      expect(names.length).toBe(99);
    });

    it("should get single name by id", () => {
      const name = getNameOfAllah(1);
      expect(name).toBeDefined();
      expect(name?.id).toBe(1);
    });

    it("should get single name asynchronously", async () => {
      const name = await getNameOfAllahAsync(1);
      expect(name).toBeDefined();
    });

    it("should search names of Allah", () => {
      const matches = searchNamesOfAllah("الرحمن");
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  // ── Companions ──
  describe("Companions (Sahabah)", () => {
    it("should get all companions", () => {
      const list = getCompanions();
      expect(list.length).toBeGreaterThan(0);
    });

    it("should get a single companion by id", () => {
      const c = getCompanion(1);
      expect(c).toBeDefined();
      expect(c?.id).toBe(1);
    });

    it("should search companions", () => {
      const matches = searchCompanions("فارسی");
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  // ── Seerah ──
  describe("Seerah", () => {
    it("should get seerah list", () => {
      const list = getSeerah();
      expect(list.length).toBeGreaterThan(0);
    });

    it("should get seerah entry by id", () => {
      // event ids start at 101 in seerah.json
      const entry = getSeerahEntry(101);
      expect(entry).toBeDefined();
    });

    it("should search seerah", () => {
      const matches = searchSeerah("محمد");
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  // ── Library ──
  describe("Library", () => {
    it("should get library list", () => {
      const list = getLibrary();
      expect(list.length).toBeGreaterThan(0);
    });

    it("should get library item by id", () => {
      const item = getLibraryItem(1);
      expect(item).toBeDefined();
    });

    it("should search library", () => {
      const matches = searchLibrary("ڕەحیقی");
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  // ── Configuration ──
  describe("Configuration utilities", () => {
    it("should allow setting base URL and data loader", () => {
      expect(() => setBaseUrl("https://mycdn.com/data")).not.toThrow();
      expect(() => setDataLoader(async () => ({}))).not.toThrow();
    });
  });
});
