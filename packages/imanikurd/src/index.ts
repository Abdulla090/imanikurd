// Quran — complete 6236 ayahs, 114 surahs
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
} from "./quran.js";
export type { Ayah, AyahWithTafsir, QuranData, Surah } from "./quran.js";

// Tafsir — 13 Kurdish translations
export {
  TAFSIR_OPTIONS,
  getTafsirOptions,
  getTafsir,
  getTafsirForAyah,
  getTafsirForSurah,
  searchTafsir,
} from "./tafsir.js";
export type { TafsirEntry, TafsirOption } from "./tafsir.js";

// Qibla direction
export {
  KAABA_COORDINATES,
  calculateQibla,
  getQibla,
  isFacingQibla,
  getDistanceToKaaba,
  getKaabaCoordinates,
} from "./qibla.js";

// Prayer times for Kurdistan cities
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
} from "./prayer.js";
export type {
  DayPrayerRecord,
  NextPrayer,
  PrayerTimings,
  PrayerTimesData,
} from "./prayer.js";

// Cities
export {
  getCityByCoordinates,
  getCityDisplayName,
  getCity,
} from "./cities.js";
export type { City } from "./cities.js";

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

// Hadith
export { getHadiths, getHadith, searchHadiths, getHadithCount } from "./hadith.js";
export type { Hadith } from "./hadith.js";

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

// Audio recitations
export { QARI_OPTIONS, getQariOptions, getRecitationUrl, getQari } from "./audio.js";
export type { Qari } from "./audio.js";

// Utilities
export { loadData, clearDataCache, getDataFilePath } from "./loadData.js";
export type { Coordinates, QiblaResult } from "./types.js";

/** Package version info */
export const PACKAGE_NAME = "imanikurd";
export const PACKAGE_VERSION = "1.0.0";
