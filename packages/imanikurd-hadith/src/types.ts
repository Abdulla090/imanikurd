/** Surah (chapter) metadata */
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan" | string;
  kurdishName?: string;
  place?: string;
  juz?: string;
  audioLink?: string;
  startPage?: number;
  endPage?: number;
  suraNameFormatted?: string;
}

/** Single Quran ayah (verse) */
export interface Ayah {
  surah: number;
  ayah: number;
  text: string;
  juz: number;
  page: number;
  audioLink?: string;
}

/** Complete Quran dataset */
export interface QuranData {
  metadata: {
    totalSurahs: number;
    totalAyahs: number;
    source: string;
  };
  surahs: Surah[];
  ayahs: Ayah[];
}

/** Ayah with optional tafsir translation */
export interface AyahWithTafsir extends Ayah {
  tafsir?: string;
}

/** Tafsir entry (compact format) */
export interface TafsirEntry {
  s: number;
  a: number;
  t: string;
}

/** Tafsir option metadata */
export interface TafsirOption {
  id: string;
  name: string;
  file: string;
}

/** Prayer time timings */
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

/** Daily prayer record */
export interface DayPrayerRecord {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/** Prayer times database keyed by city */
export type PrayerTimesData = Record<string, DayPrayerRecord[]>;

/** Dhikr (remembrance) category */
export interface DhikrCategory {
  id: number;
  name: string;
}

/** Single dhikr item */
export interface DhikrItem {
  id: number;
  categoryId: number;
  arabic: string;
  kurdish: string;
  count: number;
}

/** Dhikr dataset */
export interface DhikrData {
  categories: DhikrCategory[];
  items: DhikrItem[];
}

/** Hadith entry */
export interface Hadith {
  id: number;
  title: string;
  arabic: string;
  kurdish: string;
  isFavorite?: boolean;
}

/** Name of Allah (Asma ul Husna) */
export interface NameOfAllah {
  id: number;
  arabic: string;
  kurdish: string;
  english: string;
}

/** Quran reciter (Qari) */
export interface Qari {
  id: string;
  name: string;
  nameAr: string;
  getUrl: (surahNumber: number) => string;
}

/** City for prayer times / Qibla */
export interface City {
  key: string;
  name: string;
  nameKurdish: string;
  lat: number;
  lng: number;
  radius: number;
}

/** Coordinates */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** Qibla calculation result */
export interface QiblaResult {
  direction: number;
  kaaba: Coordinates;
  from: Coordinates;
}

/** Next prayer info */
export interface NextPrayer {
  name: string;
  time: string;
  hoursUntil: number;
  minutesUntil: number;
}
