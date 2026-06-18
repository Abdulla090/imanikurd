import { loadData } from "./loadData.js";

export interface LibraryItem {
  id: number;
  title: string;
  author?: string;
  url?: string;
  description?: string;
  [key: string]: unknown;
}

let libraryCache: LibraryItem[] | null = null;

function getLibraryData(): LibraryItem[] {
  if (!libraryCache) {
    libraryCache = loadData<LibraryItem[]>("library.json");
  }
  return libraryCache;
}

/** Get Islamic library book list */
export function getLibrary(): LibraryItem[] {
  return getLibraryData();
}

/** Get a library item by id */
export function getLibraryItem(id: number): LibraryItem | undefined {
  return getLibraryData().find((item) => item.id === id);
}

/** Search library by title or author */
export function searchLibrary(query: string): LibraryItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getLibraryData().filter(
    (item) =>
      String(item.title || "").toLowerCase().includes(normalized) ||
      String(item.author || "").toLowerCase().includes(normalized)
  );
}

