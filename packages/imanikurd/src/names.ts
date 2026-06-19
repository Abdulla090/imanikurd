import { loadData, loadDataAsync } from "./loadData.js";
import type { NameOfAllah } from "./types.js";

let namesCache: NameOfAllah[] | null = null;

function getNamesData(): NameOfAllah[] {
  if (!namesCache) {
    namesCache = loadData<NameOfAllah[]>("names_of_allah.json");
  }
  return namesCache;
}

async function getNamesDataAsync(): Promise<NameOfAllah[]> {
  if (!namesCache) {
    namesCache = await loadDataAsync<NameOfAllah[]>("names_of_allah.json");
  }
  return namesCache;
}

/** Get all 99 Names of Allah (Asma ul Husna) */
export function getNamesOfAllah(): NameOfAllah[] {
  return getNamesData();
}

/** Get all 99 Names of Allah (Asma ul Husna) asynchronously */
export async function getNamesOfAllahAsync(): Promise<NameOfAllah[]> {
  return getNamesDataAsync();
}

/** Get a single name by id (1-99) */
export function getNameOfAllah(id: number): NameOfAllah | undefined {
  return getNamesData().find((n) => n.id === id);
}

/** Get a single name by id (1-99) asynchronously */
export async function getNameOfAllahAsync(id: number): Promise<NameOfAllah | undefined> {
  const data = await getNamesDataAsync();
  return data.find((n) => n.id === id);
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

/** Search names by Arabic, Kurdish, or English asynchronously */
export async function searchNamesOfAllahAsync(query: string): Promise<NameOfAllah[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const data = await getNamesDataAsync();
  return data.filter(
    (n) =>
      n.arabic.includes(query.trim()) ||
      n.kurdish.toLowerCase().includes(normalized) ||
      n.english.toLowerCase().includes(normalized)
  );
}

export type { NameOfAllah };
