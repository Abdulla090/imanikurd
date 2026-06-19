import { loadData, loadDataAsync } from "./loadData.js";

export interface LibraryItem {
  id: number;
  title: string;
  author?: string;
  url?: string;
  description?: string;
  [key: string]: unknown;
}

interface LibraryData {
  books: LibraryItem[];
}

let libraryCache: LibraryItem[] | null = null;

function getLibraryData(): LibraryItem[] {
  if (!libraryCache) {
    const raw = loadData<LibraryData>("library.json");
    libraryCache = raw.books || [];
  }
  return libraryCache;
}

async function getLibraryDataAsync(): Promise<LibraryItem[]> {
  if (!libraryCache) {
    const raw = await loadDataAsync<LibraryData>("library.json");
    libraryCache = raw.books || [];
  }
  return libraryCache;
}

/** Get Islamic library book list */
export function getLibrary(): LibraryItem[] {
  return getLibraryData();
}

/** Get Islamic library book list asynchronously */
export async function getLibraryAsync(): Promise<LibraryItem[]> {
  return getLibraryDataAsync();
}

/** Get a library item by id */
export function getLibraryItem(id: number): LibraryItem | undefined {
  return getLibraryData().find((item) => item.id === id);
}

/** Get a library item by id asynchronously */
export async function getLibraryItemAsync(id: number): Promise<LibraryItem | undefined> {
  const data = await getLibraryDataAsync();
  return data.find((item) => item.id === id);
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

/** Search library by title or author asynchronously */
export async function searchLibraryAsync(query: string): Promise<LibraryItem[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const data = await getLibraryDataAsync();
  return data.filter(
    (item) =>
      String(item.title || "").toLowerCase().includes(normalized) ||
      String(item.author || "").toLowerCase().includes(normalized)
  );
}
