import { loadData } from "./loadData.js";
import type { NameOfAllah } from "./types.js";

let namesCache: NameOfAllah[] | null = null;

function getNamesData(): NameOfAllah[] {
  if (!namesCache) {
    namesCache = loadData<NameOfAllah[]>("names_of_allah.json");
  }
  return namesCache;
}

/** Get all 99 Names of Allah (Asma ul Husna) */
export function getNamesOfAllah(): NameOfAllah[] {
  return getNamesData();
}

/** Get a single name by id (1-99) */
export function getNameOfAllah(id: number): NameOfAllah | undefined {
  return getNamesData().find((n) => n.id === id);
}

/** Search names by Arabic, Kurdish, or English */
export function searchNamesOfAllah(query: string): NameOfAllah[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getNamesData().filter(
    (n) =>
      n.arabic.includes(query.trim()) ||
      n.kurdish.toLowerCase().includes(normalized) ||
      n.english.toLowerCase().includes(normalized)
  );
}

export type { NameOfAllah };
