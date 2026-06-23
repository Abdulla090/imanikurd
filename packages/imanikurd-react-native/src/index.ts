import {
  setDataLoader,
  setBaseUrl,
  clearDataCache,
} from "imanikurd";

export * from "imanikurd";

/** Map of data filenames to pre-imported JSON data objects */
type AssetMap = Record<string, unknown>;

let configured = false;

/**
 * Configure imanikurd to load bundled JSON assets in React Native.
 *
 * @example
 * ```ts
 * import { setupImanikurd } from "imanikurd-react-native";
 * import quran from "imanikurd-react-native/data/quran.json";
 *
 * setupImanikurd({ "quran.json": quran });
 * ```
 */
export function setupImanikurd(assets: AssetMap): void {
  setDataLoader(async (filename: string) => {
    const data = assets[filename];
    if (data == null) {
      throw new Error(
        `imanikurd-react-native: Missing asset "${filename}". ` +
          `Register it in setupImanikurd() or import from imanikurd-react-native/data/.`
      );
    }
    return data;
  });
  configured = true;
}

/** Load all core data files for offline use in React Native. */
export async function setupImanikurdOffline(assets: AssetMap): Promise<void> {
  setupImanikurd(assets);
  clearDataCache();
}

/** Whether setupImanikurd has been called */
export function isImanikurdConfigured(): boolean {
  return configured;
}

/**
 * Use remote CDN data (smaller app bundle). Falls back to unpkg-hosted imanikurd data.
 */
export function setupImanikurdRemote(baseUrl?: string): void {
  setBaseUrl(baseUrl ?? "https://unpkg.com/imanikurd@1.1.1/data/");
  clearDataCache();
  configured = true;
}

export const PACKAGE_NAME = "imanikurd-react-native";
export const PACKAGE_VERSION = "1.1.1";
