import { readFileSync, existsSync, readFile } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const isBrowser = typeof window !== "undefined" || typeof self !== "undefined";

let customLoader: ((filename: string) => Promise<any>) | null = null;
let baseUrl = "https://unpkg.com/imanikurd@1.1.0/data/";

export function setDataLoader(loader: (filename: string) => Promise<any>): void {
  customLoader = loader;
}

export function setBaseUrl(url: string): void {
  baseUrl = url;
  if (!baseUrl.endsWith("/")) {
    baseUrl += "/";
  }
}

function getModuleDir(): string {
  if (isBrowser) return "";
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  return dirname(fileURLToPath(import.meta.url));
}

const moduleDir = isBrowser ? "" : getModuleDir();

const cache = new Map<string, unknown>();

function resolveDataPath(filename: string): string {
  if (isBrowser) {
    throw new Error("imanikurd: Local file paths are not available in browser environments.");
  }
  const candidates = [
    join(moduleDir, "..", "data", filename),
    join(moduleDir, "data", filename),
    join(process.cwd(), "node_modules", "imanikurd", "data", filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `imanikurd: data file "${filename}" not found. Ensure the package is installed correctly.`
  );
}

/** Load and cache a JSON data file from the package data directory synchronously (Node-only) */
export function loadData<T>(filename: string): T {
  if (cache.has(filename)) {
    return cache.get(filename) as T;
  }

  if (isBrowser) {
    throw new Error(
      `imanikurd: Synchronous data loading is not supported in browser environments. Use the asynchronous APIs.`
    );
  }

  const filePath = resolveDataPath(filename);
  const data = JSON.parse(readFileSync(filePath, "utf-8")) as T;
  cache.set(filename, data);
  return data;
}

/** Load and cache a JSON data file asynchronously (Node + Browser) */
export async function loadDataAsync<T>(filename: string): Promise<T> {
  if (cache.has(filename)) {
    return cache.get(filename) as T;
  }

  if (customLoader) {
    const data = await customLoader(filename) as T;
    cache.set(filename, data);
    return data;
  }

  if (isBrowser) {
    const url = `${baseUrl}${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`imanikurd: Failed to fetch data file from ${url} (status: ${response.status})`);
    }
    const data = await response.json() as T;
    cache.set(filename, data);
    return data;
  }

  // Node.js async read
  const filePath = resolveDataPath(filename);
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf-8", (err, dataStr) => {
      if (err) return reject(err);
      try {
        const data = JSON.parse(dataStr) as T;
        cache.set(filename, data);
        resolve(data);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

/** Clear the in-memory data cache */
export function clearDataCache(): void {
  cache.clear();
}

/** Get the absolute path to a data file in the package */
export function getDataFilePath(filename: string): string {
  return resolveDataPath(filename);
}

