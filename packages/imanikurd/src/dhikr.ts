import { loadData } from "./loadData.js";
import type { DhikrCategory, DhikrData, DhikrItem } from "./types.js";

let dhikrCache: DhikrData | null = null;

function getDhikrData(): DhikrData {
  if (!dhikrCache) {
    dhikrCache = loadData<DhikrData>("dhikr.json");
  }
  return dhikrCache;
}

/** Get all dhikr categories (morning, evening, after prayer, etc.) */
export function getDhikrCategories(): DhikrCategory[] {
  return getDhikrData().categories;
}

/** Get all dhikr items */
export function getDhikrItems(): DhikrItem[] {
  return getDhikrData().items;
}

/** Get dhikr items for a specific category */
export function getDhikrByCategory(categoryId: number): DhikrItem[] {
  return getDhikrData().items.filter((item) => item.categoryId === categoryId);
}

/** Get a single dhikr item by id */
export function getDhikrById(id: number): DhikrItem | undefined {
  return getDhikrData().items.find((item) => item.id === id);
}

/** Search dhikr by Kurdish or Arabic text */
export function searchDhikr(query: string): DhikrItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getDhikrData().items.filter(
    (item) =>
      item.kurdish.toLowerCase().includes(normalized) ||
      item.arabic.includes(query.trim())
  );
}

/** Get category with its items */
export function getDhikrCategoryWithItems(categoryId: number) {
  const category = getDhikrData().categories.find((c) => c.id === categoryId);
  if (!category) return null;

  return {
    category,
    items: getDhikrByCategory(categoryId),
  };
}

export type { DhikrCategory, DhikrData, DhikrItem };
