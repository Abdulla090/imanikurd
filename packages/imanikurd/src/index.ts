// Quran & Tafsir & Audio — imported from imanikurd-quran
export {
  getQuranMetadata,
  getSurahs,
  getSurah,
  getSurahAyahs,
  getAyah,
  getFullQuran,
  getJuzAyahs,
  getPageAyahs,
  searchQuran,
  getTotalAyahCount,
  attachTafsir,
  TAFSIR_OPTIONS,
  getTafsirOptions,
  getTafsir,
  getTafsirForAyah,
  getTafsirForSurah,
  searchTafsir,
  QARI_OPTIONS,
  getQariOptions,
  getRecitationUrl,
  getQari,
} from "imanikurd-quran";
export type {
  Ayah,
  AyahWithTafsir,
  QuranData,
  Surah,
  TafsirEntry,
  TafsirOption,
  Qari,
} from "imanikurd-quran";

// Hadith — imported from imanikurd-hadith
export { getHadiths, getHadith, searchHadiths, getHadithCount } from "imanikurd-hadith";
export type { Hadith } from "imanikurd-hadith";

// Prayer times, Cities, & Qibla — imported from imanikurd-prayer
export {
  getPrayerCities,
  getPrayerTimes,
  getDailyPrayerRecord,
  getMonthlyPrayerTimes,
  getCityFromCoordinates,
  getCityName,
  getNextPrayer,
  getPrayerTimesByLocation,
  KURDISTAN_CITIES,
  KAABA_COORDINATES,
  calculateQibla,
  getQibla,
  isFacingQibla,
  getDistanceToKaaba,
  getKaabaCoordinates,
  getCityByCoordinates,
  getCityDisplayName,
  getCity,
} from "imanikurd-prayer";
export type {
  DayPrayerRecord,
  NextPrayer,
  PrayerTimings,
  PrayerTimesData,
  City,
} from "imanikurd-prayer";

// Remaining lightweight features kept in the main package
// Dhikr / Azkar
export {
  getDhikrCategories,
  getDhikrItems,
  getDhikrByCategory,
  getDhikrById,
  searchDhikr,
  getDhikrCategoryWithItems,
} from "./dhikr.js";
export type { DhikrCategory, DhikrData, DhikrItem } from "./dhikr.js";

// Names of Allah
export { getNamesOfAllah, getNameOfAllah, searchNamesOfAllah } from "./names.js";
export type { NameOfAllah } from "./names.js";

// Companions
export { getCompanions, getCompanion, searchCompanions } from "./companions.js";
export type { Companion } from "./companions.js";

// Seerah
export { getSeerah, getSeerahEntry, searchSeerah } from "./seerah.js";
export type { SeerahEntry } from "./seerah.js";

// Library
export { getLibrary, getLibraryItem, searchLibrary } from "./library.js";
export type { LibraryItem } from "./library.js";

// Utilities
export { loadData, clearDataCache, getDataFilePath } from "./loadData.js";
export type { Coordinates, QiblaResult } from "./types.js";

/** Package version info */
export const PACKAGE_NAME = "imanikurd";
export const PACKAGE_VERSION = "1.0.0";
