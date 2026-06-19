import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function getModuleDir(): string {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  return dirname(fileURLToPath(import.meta.url));
}

const moduleDir = getModuleDir();

const cache = new Map<string, unknown>();

function resolveDataPath(filename: string): string {
  const candidates = [
    join(moduleDir, "..", "data", filename),
    join(moduleDir, "data", filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `imanikurd: data file "${filename}" not found. Ensure the package is installed correctly.`
  );
}

/** Load and cache a JSON data file from the package data directory */
export function loadData<T>(filename: string): T {
  if (cache.has(filename)) {
    return cache.get(filename) as T;
  }

  const filePath = resolveDataPath(filename);
  const data = JSON.parse(readFileSync(filePath, "utf-8")) as T;
  cache.set(filename, data);
  return data;
}

/** Clear the in-memory data cache */
export function clearDataCache(): void {
  cache.clear();
}

/** Get the absolute path to a data file in the package */
export function getDataFilePath(filename: string): string {
  return resolveDataPath(filename);
}
