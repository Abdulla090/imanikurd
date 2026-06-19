import { KURDISTAN_CITIES, getCityByCoordinates, getCityDisplayName } from "./cities.js";
import { loadData, loadDataAsync } from "./loadData.js";
import type {
  DayPrayerRecord,
  NextPrayer,
  PrayerTimings,
  PrayerTimesData,
} from "./types.js";

let prayerCache: PrayerTimesData | null = null;

function getPrayerData(): PrayerTimesData {
  if (!prayerCache) {
    prayerCache = loadData<PrayerTimesData>("prayer_times.json");
  }
  return prayerCache;
}

async function getPrayerDataAsync(): Promise<PrayerTimesData> {
  if (!prayerCache) {
    prayerCache = await loadDataAsync<PrayerTimesData>("prayer_times.json");
  }
  return prayerCache;
}

function formatDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function toTimings(record: DayPrayerRecord): PrayerTimings {
  return {
    Fajr: record.fajr,
    Sunrise: record.sunrise,
    Dhuhr: record.dhuhr,
    Asr: record.asr,
    Maghrib: record.maghrib,
    Isha: record.isha,
  };
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.split(" ")[0].trim();
  const [h, m] = cleaned.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

/** Get all available city keys for prayer times */
export function getPrayerCities(): string[] {
  return Object.keys(getPrayerData()).sort();
}

/** Get all available city keys for prayer times asynchronously */
export async function getPrayerCitiesAsync(): Promise<string[]> {
  const data = await getPrayerDataAsync();
  return Object.keys(data).sort();
}

/** Get prayer times for a city on a specific date (defaults to today) */
export function getPrayerTimes(
  cityKey: string,
  date: Date = new Date()
): PrayerTimings | null {
  const data = getPrayerData();
  const cityRecords = data[cityKey] || data["Hawler"];
  if (!cityRecords) return null;

  const dateKey = formatDateKey(date);
  const record = cityRecords.find((r) => r.date === dateKey);
  return record ? toTimings(record) : null;
}

/** Get prayer times for a city on a specific date asynchronously */
export async function getPrayerTimesAsync(
  cityKey: string,
  date: Date = new Date()
): Promise<PrayerTimings | null> {
  const data = await getPrayerDataAsync();
  const cityRecords = data[cityKey] || data["Hawler"];
  if (!cityRecords) return null;

  const dateKey = formatDateKey(date);
  const record = cityRecords.find((r) => r.date === dateKey);
  return record ? toTimings(record) : null;
}

/** Get full daily record including date string */
export function getDailyPrayerRecord(
  cityKey: string,
  date: Date = new Date()
): (DayPrayerRecord & { timings: PrayerTimings }) | null {
  const data = getPrayerData();
  const cityRecords = data[cityKey] || data["Hawler"];
  if (!cityRecords) return null;

  const dateKey = formatDateKey(date);
  const record = cityRecords.find((r) => r.date === dateKey);
  if (!record) return null;

  return { ...record, timings: toTimings(record) };
}

/** Get full daily record including date string asynchronously */
export async function getDailyPrayerRecordAsync(
  cityKey: string,
  date: Date = new Date()
): Promise<(DayPrayerRecord & { timings: PrayerTimings }) | null> {
  const data = await getPrayerDataAsync();
  const cityRecords = data[cityKey] || data["Hawler"];
  if (!cityRecords) return null;

  const dateKey = formatDateKey(date);
  const record = cityRecords.find((r) => r.date === dateKey);
  if (!record) return null;

  return { ...record, timings: toTimings(record) };
}

/** Get all prayer times for a city in a given month */
export function getMonthlyPrayerTimes(
  cityKey: string,
  month: number,
  year: number = new Date().getFullYear()
) {
  const data = getPrayerData();
  const cityRecords = data[cityKey] || data["Hawler"] || [];

  return cityRecords
    .filter((record) => {
      const [mm] = record.date.split("-").map(Number);
      return mm === month;
    })
    .map((record) => {
      const [mm, dd] = record.date.split("-").map(Number);
      return {
        date: new Date(year, mm - 1, dd),
        day: dd,
        month: mm,
        timings: toTimings(record),
      };
    })
    .sort((a, b) => a.day - b.day);
}

/** Get all prayer times for a city in a given month asynchronously */
export async function getMonthlyPrayerTimesAsync(
  cityKey: string,
  month: number,
  year: number = new Date().getFullYear()
) {
  const data = await getPrayerDataAsync();
  const cityRecords = data[cityKey] || data["Hawler"] || [];

  return cityRecords
    .filter((record) => {
      const [mm] = record.date.split("-").map(Number);
      return mm === month;
    })
    .map((record) => {
      const [mm, dd] = record.date.split("-").map(Number);
      return {
        date: new Date(year, mm - 1, dd),
        day: dd,
        month: mm,
        timings: toTimings(record),
      };
    })
    .sort((a, b) => a.day - b.day);
}

/** Detect nearest Kurdistan city from coordinates */
export function getCityFromCoordinates(lat: number, lng: number): string {
  return getCityByCoordinates(lat, lng).key;
}

/** Get Kurdish display name for a city key */
export function getCityName(cityKey: string): string {
  return getCityDisplayName(cityKey);
}

/** Get the next upcoming prayer for a city */
export function getNextPrayer(
  cityKey: string,
  now: Date = new Date()
): NextPrayer | null {
  const timings = getPrayerTimes(cityKey, now);
  if (!timings) return null;

  const prayers = [
    { name: "Fajr", time: timings.Fajr },
    { name: "Sunrise", time: timings.Sunrise },
    { name: "Dhuhr", time: timings.Dhuhr },
    { name: "Asr", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isha", time: timings.Isha },
  ];

  const currentMins = now.getHours() * 60 + now.getMinutes();

  for (const prayer of prayers) {
    const prayerMins = parseTimeToMinutes(prayer.time);
    if (prayerMins > currentMins) {
      const diff = prayerMins - currentMins;
      return {
        name: prayer.name,
        time: prayer.time,
        hoursUntil: Math.floor(diff / 60),
        minutesUntil: diff % 60,
      };
    }
  }

  const fajrMins = parseTimeToMinutes(prayers[0].time);
  const diff = 24 * 60 - currentMins + fajrMins;
  return {
    name: prayers[0].name,
    time: prayers[0].time,
    hoursUntil: Math.floor(diff / 60),
    minutesUntil: diff % 60,
  };
}

/** Get the next upcoming prayer for a city asynchronously */
export async function getNextPrayerAsync(
  cityKey: string,
  now: Date = new Date()
): Promise<NextPrayer | null> {
  const timings = await getPrayerTimesAsync(cityKey, now);
  if (!timings) return null;

  const prayers = [
    { name: "Fajr", time: timings.Fajr },
    { name: "Sunrise", time: timings.Sunrise },
    { name: "Dhuhr", time: timings.Dhuhr },
    { name: "Asr", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isha", time: timings.Isha },
  ];

  const currentMins = now.getHours() * 60 + now.getMinutes();

  for (const prayer of prayers) {
    const prayerMins = parseTimeToMinutes(prayer.time);
    if (prayerMins > currentMins) {
      const diff = prayerMins - currentMins;
      return {
        name: prayer.name,
        time: prayer.time,
        hoursUntil: Math.floor(diff / 60),
        minutesUntil: diff % 60,
      };
    }
  }

  const fajrMins = parseTimeToMinutes(prayers[0].time);
  const diff = 24 * 60 - currentMins + fajrMins;
  return {
    name: prayers[0].name,
    time: prayers[0].time,
    hoursUntil: Math.floor(diff / 60),
    minutesUntil: diff % 60,
  };
}

/** Get prayer times using geolocation (auto-detect city) */
export function getPrayerTimesByLocation(
  lat: number,
  lng: number,
  date: Date = new Date()
): PrayerTimings | null {
  const cityKey = getCityFromCoordinates(lat, lng);
  return getPrayerTimes(cityKey, date);
}

/** Get prayer times using geolocation (auto-detect city) asynchronously */
export async function getPrayerTimesByLocationAsync(
  lat: number,
  lng: number,
  date: Date = new Date()
): Promise<PrayerTimings | null> {
  const cityKey = getCityFromCoordinates(lat, lng);
  return getPrayerTimesAsync(cityKey, date);
}

export { KURDISTAN_CITIES };

export type { DayPrayerRecord, NextPrayer, PrayerTimings, PrayerTimesData };

