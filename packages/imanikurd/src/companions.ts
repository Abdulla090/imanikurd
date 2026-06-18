import { loadData } from "./loadData.js";

export interface Companion {
  id: number;
  name: string;
  arabic?: string;
  description?: string;
  [key: string]: unknown;
}

let companionsCache: Companion[] | null = null;

function getCompanionsData(): Companion[] {
  if (!companionsCache) {
    companionsCache = loadData<Companion[]>("companions.json");
  }
  return companionsCache;
}

/** Get all companions (Sahabah) biographies */
export function getCompanions(): Companion[] {
  return getCompanionsData();
}

/** Get a companion by id */
export function getCompanion(id: number): Companion | undefined {
  return getCompanionsData().find((c) => c.id === id);
}

/** Search companions by name */
export function searchCompanions(query: string): Companion[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getCompanionsData().filter((c) => {
    const name = String(c.name || "").toLowerCase();
    const arabic = String(c.arabic || "");
    const desc = String(c.description || "").toLowerCase();
    return name.includes(normalized) || arabic.includes(query.trim()) || desc.includes(normalized);
  });
}

