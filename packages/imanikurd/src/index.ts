// Quran & Tafsir & Audio — imported from imanikurd-quran
export {
  getQuranMetadata,
  getQuranMetadataAsync,
  getSurahs,
  getSurahsAsync,
  getSurah,
  getSurahAsync,
  getSurahAyahs,
  getSurahAyahsAsync,
  getAyah,
  getAyahAsync,
  getFullQuran,
  getFullQuranAsync,
  getJuzAyahs,
  getJuzAyahsAsync,
  getPageAyahs,
  getPageAyahsAsync,
  searchQuran,
  searchQuranAsync,
  getTotalAyahCount,
  getTotalAyahCountAsync,
  attachTafsir,
  TAFSIR_OPTIONS,
  getTafsirOptions,
  getTafsir,
  getTafsirAsync,
  getTafsirForAyah,
  getTafsirForAyahAsync,
  getTafsirForSurah,
  getTafsirForSurahAsync,
  searchTafsir,
  searchTafsirAsync,
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
export {
  getHadiths,
  getHadithsAsync,
  getHadith,
  getHadithAsync,
  searchHadiths,
  searchHadithsAsync,
  getHadithCount,
  getHadithCountAsync,
} from "imanikurd-hadith";
export type { Hadith } from "imanikurd-hadith";

// Prayer times, Cities, & Qibla — imported from imanikurd-prayer
export {
  getPrayerCities,
  getPrayerCitiesAsync,
  getPrayerTimes,
  getPrayerTimesAsync,
  getDailyPrayerRecord,
  getDailyPrayerRecordAsync,
  getMonthlyPrayerTimes,
  getMonthlyPrayerTimesAsync,
  getCityFromCoordinates,
  getCityName,
  getNextPrayer,
  getNextPrayerAsync,
  getPrayerTimesByLocation,
  getPrayerTimesByLocationAsync,
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
  getDhikrCategoriesAsync,
  getDhikrItems,
  getDhikrItemsAsync,
  getDhikrByCategory,
  getDhikrByCategoryAsync,
  getDhikrById,
  getDhikrByIdAsync,
  searchDhikr,
  searchDhikrAsync,
  getDhikrCategoryWithItems,
  getDhikrCategoryWithItemsAsync,
} from "./dhikr.js";
export type { DhikrCategory, DhikrData, DhikrItem } from "./dhikr.js";

// Names of Allah
export {
  getNamesOfAllah,
  getNamesOfAllahAsync,
  getNameOfAllah,
  getNameOfAllahAsync,
  searchNamesOfAllah,
  searchNamesOfAllahAsync,
} from "./names.js";
export type { NameOfAllah } from "./names.js";

// Companions
export {
  getCompanions,
  getCompanionsAsync,
  getCompanion,
  getCompanionAsync,
  searchCompanions,
  searchCompanionsAsync,
} from "./companions.js";
export type { Companion } from "./companions.js";

// Seerah
export {
  getSeerah,
  getSeerahAsync,
  getSeerahEntry,
  getSeerahEntryAsync,
  searchSeerah,
  searchSeerahAsync,
} from "./seerah.js";
export type { SeerahEntry } from "./seerah.js";

// Library
export {
  getLibrary,
  getLibraryAsync,
  getLibraryItem,
  getLibraryItemAsync,
  searchLibrary,
  searchLibraryAsync,
} from "./library.js";
export type { LibraryItem } from "./library.js";

// Utilities
export {
  loadData,
  loadDataAsync,
  clearDataCache,
  getDataFilePath,
  setDataLoader,
  setBaseUrl,
} from "./loadData.js";
export type { Coordinates, QiblaResult } from "./types.js";

/** Package version info */
export const PACKAGE_NAME = "imanikurd";
export const PACKAGE_VERSION = "1.1.0";
