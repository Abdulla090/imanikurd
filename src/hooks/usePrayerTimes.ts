
import { useState, useEffect, useRef, useCallback } from "react";
// Import the comprehensive JSON data from Noor Database
// @ts-ignore
import prayerDataDB from '../data/prayer_times_db.json';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimesData {
  timings: PrayerTimes;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { en: string; ar: string };
      year: string;
      day: string;
    };
    gregorian: {
      date: string;
      month: { en: string };
      year: string;
      day: string;
    };
  };
  meta: {
    timezone: string;
  };
}

// New DB Format: { "CityName": [ { date: "01-01", fajr: "...", ... } ] }
type DayPrayerRecord = {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

type FullPrayerData = {
  [city: string]: DayPrayerRecord[];
};

const prayerData = prayerDataDB as FullPrayerData;

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null); // Explicitly selected city
  const initialized = useRef(false);

  // Helper: Get City Name based on coordinates
  const getCityName = (lat: number, lng: number): string => {
    // Map coords to DB keys
    const cities = [
      { key: "Hawler", name: "هەولێر", lat: 36.19, lng: 44.01, radius: 0.4 },
      { key: "Slemani", name: "سلێمانی", lat: 35.56, lng: 45.44, radius: 0.4 },
      { key: "Duhok", name: "دهۆک", lat: 36.87, lng: 42.99, radius: 0.4 },
      { key: "Kirkuk", name: "کەرکوک", lat: 35.47, lng: 44.39, radius: 0.4 },
      { key: "Zakho", name: "زاخۆ", lat: 37.15, lng: 42.68, radius: 0.3 },
      { key: "Halabja", name: "ھەڵەبجە", lat: 35.18, lng: 45.98, radius: 0.3 },
      { key: "Koya", name: "کۆیە", lat: 36.08, lng: 44.63, radius: 0.3 },
      { key: "Akre", name: "ئاکرێ", lat: 36.74, lng: 43.88, radius: 0.3 },
      { key: "Qaladze", name: "قەڵادزێ", lat: 36.18, lng: 45.11, radius: 0.3 },
      { key: "Darbandikhan", name: "دەربەندیخان", lat: 35.11, lng: 45.69, radius: 0.3 },
      // Fallback
      { key: "Hawler", name: "هەرێمی کوردستان", lat: 36.0, lng: 44.0, radius: 100.0 }
    ];

    for (const city of cities) {
      const distance = Math.sqrt(
        Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
      );
      if (distance <= city.radius) {
        return city.key;
      }
    }
    return "Hawler"; // Default
  };

  const getHijriDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).formatToParts(date);
  };

  const fetchMobilePrayerTimes = async (lat: number, lng: number, forceCity?: string) => {
    setLoading(true);
    try {
      // Use selected city if available, otherwise detect
      const cityKey = forceCity || selectedCity || getCityName(lat, lng);
      console.log(`Looking up prayer times for city: ${cityKey}`);

      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateKey = `${month}-${day}`; // Format MM-DD

      // 1. Try Local JSON Data
      // Type assertion needed because keys are dynamic
      const dbData = prayerData as FullPrayerData;
      const cityDailyRecords = dbData[cityKey] || dbData['Hawler'];

      let timings: PrayerTimes;

      // Find today's record
      const todayRecord = cityDailyRecords.find(r => r.date === dateKey);

      if (todayRecord) {
        timings = {
          Fajr: todayRecord.fajr,
          Sunrise: todayRecord.sunrise,
          Dhuhr: todayRecord.dhuhr,
          Asr: todayRecord.asr,
          Maghrib: todayRecord.maghrib,
          Isha: todayRecord.isha
        };
        console.log("Found local data:", timings);
      } else {
        console.warn("Local data missing for date", dateKey);
        throw new Error("Local data not found");
      }

      // Construct response object
      const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(today);

      const data: PrayerTimesData = {
        timings,
        date: {
          readable: today.toLocaleDateString(),
          hijri: {
            date: hijriDate,
            month: { en: "", ar: hijriDate.split(' ')[1] || "" },
            year: hijriDate.split(' ')[2] || "",
            day: hijriDate.split(' ')[0] || ""
          },
          gregorian: {
            date: today.toLocaleDateString(),
            month: { en: today.toLocaleString('default', { month: 'long' }) },
            year: String(today.getFullYear()),
            day: String(today.getDate())
          }
        },
        meta: {
          timezone: "Asia/Baghdad"
        }
      };

      setPrayerTimes(data);
      setError(null);
    } catch (err) {
      console.error("Local lookup failed, falling back to API", err);
      // Fallback
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${lat}&longitude=${lng}&method=2`
        );
        const result = await response.json();
        if (result.data) setPrayerTimes(result.data);
      } catch (apiErr) {
        setError("Could not load prayer times.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Main Effect
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // Default Location (Hawler)
      // Check localStorage
      const savedCity = localStorage.getItem('user-selected-city');
      const savedLoc = localStorage.getItem('user-location');

      if (savedCity) {
        setSelectedCity(savedCity);
      }

      if (savedLoc) {
        const { lat, lng } = JSON.parse(savedLoc);
        setLocation({ lat, lng });
        fetchMobilePrayerTimes(lat, lng, savedCity || undefined);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ lat: latitude, lng: longitude });
            localStorage.setItem('user-location', JSON.stringify({ lat: latitude, lng: longitude }));
            fetchMobilePrayerTimes(latitude, longitude, savedCity || undefined);
          },
          () => {
            // Default to Hawler
            const defLat = 36.19, defLng = 44.01;
            setLocation({ lat: defLat, lng: defLng });
            fetchMobilePrayerTimes(defLat, defLng, savedCity || undefined);
          }
        );
      } else {
        const defLat = 36.19, defLng = 44.01;
        setLocation({ lat: defLat, lng: defLng });
        fetchMobilePrayerTimes(defLat, defLng, savedCity || undefined);
      }
    }
  }, []);

  // Helper: Parse time string "HH:MM" to minutes since midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    // Handle formats like "05:30", "05:30 (EET)", etc.
    const cleaned = timeStr.split(' ')[0].trim();
    const parts = cleaned.split(':');
    if (parts.length < 2) return 0;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 60 + m;
  };

  // Helper functions used by UI
  const getNextPrayer = useCallback((): { name: string; time: string } | null => {
    if (!prayerTimes?.timings) return null;

    const prayers = [
      { name: "Fajr", time: prayerTimes.timings.Fajr },
      { name: "Sunrise", time: prayerTimes.timings.Sunrise },
      { name: "Dhuhr", time: prayerTimes.timings.Dhuhr },
      { name: "Asr", time: prayerTimes.timings.Asr },
      { name: "Maghrib", time: prayerTimes.timings.Maghrib },
      { name: "Isha", time: prayerTimes.timings.Isha },
    ];

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    // Find next prayer that hasn't passed yet
    for (const prayer of prayers) {
      const prayerMins = parseTimeToMinutes(prayer.time);
      if (prayerMins > currentMins) {
        return prayer;
      }
    }

    // All prayers have passed today, return Fajr (next day)
    return prayers[0];
  }, [prayerTimes]);

  const getTimeUntilNextPrayer = useCallback((): { hours: number; minutes: number } => {
    const next = getNextPrayer();
    if (!next) return { hours: 0, minutes: 0 };

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    let prayerMins = parseTimeToMinutes(next.time);

    // If prayer time has passed (next day's prayer), add 24 hours
    if (prayerMins <= currentMins) {
      prayerMins += 24 * 60; // Add 1440 minutes (24 hours)
    }

    const diff = prayerMins - currentMins;
    return {
      hours: Math.floor(diff / 60),
      minutes: diff % 60
    };
  }, [getNextPrayer]);

  // Get all prayer times for a specific month
  const getMonthlyPrayerTimes = useCallback((month?: number, year?: number) => {
    const targetMonth = month ?? new Date().getMonth() + 1;
    const targetYear = year ?? new Date().getFullYear();
    const cityKey = selectedCity || (location ? getCityName(location.lat, location.lng) : "Hawler");

    const dbData = prayerData as FullPrayerData;
    const cityDailyRecords = dbData[cityKey] || dbData['Hawler'] || [];

    // Filter records for the target month
    const monthRecords = cityDailyRecords.filter(record => {
      const [mm] = record.date.split('-').map(Number);
      return mm === targetMonth;
    }).map(record => {
      const [mm, dd] = record.date.split('-').map(Number);
      return {
        date: new Date(targetYear, mm - 1, dd),
        day: dd,
        month: mm,
        timings: {
          Fajr: record.fajr,
          Sunrise: record.sunrise,
          Dhuhr: record.dhuhr,
          Asr: record.asr,
          Maghrib: record.maghrib,
          Isha: record.isha
        }
      };
    });

    return monthRecords.sort((a, b) => a.day - b.day);
  }, [selectedCity, location]);

  // Public API
  return {
    prayerTimes,
    loading,
    error,
    location,
    getNextPrayer,
    getTimeUntilNextPrayer,
    getMonthlyPrayerTimes,
    getCityName: (lat: number, lng: number) => {
      const key = selectedCity || getCityName(lat, lng);
      // Map key to Kurdish display name
      const map: Record<string, string> = {
        'Hawler': 'هەولێر',
        'Slemani': 'سلێمانی',
        'Duhok': 'دهۆک',
        'Kirkuk': 'کەرکوک',
        'Zakho': 'زاخۆ',
        'Halabja': 'ھەڵەبجە',
        'Koya': 'کۆیە',
        'Soran': 'سۆران',
        'Akre': 'ئاکرێ',
        'Qaladze': 'قەڵادزێ',
        'Darbandikhan': 'دەربەندیخان',
        'Choman': 'چۆمان',
        'Penjwin': 'پێنجوێن',
        'Shaqlawa': 'شەقڵاوە',
        'Rawanduz': 'ڕەواندز',
        'Ranya': 'ڕانیە',
        'Kifri': 'کفری',
        'Chamchamal': 'چەمچەماڵ',
        'Kalar': 'کەلار',
        'Baghdad': 'بەغدا',
        'Mosul': 'موسڵ',
        'Basra': 'بەسرە'
      };
      return map[key] || key;
    },
    refetch: () => {
      if (location) fetchMobilePrayerTimes(location.lat, location.lng);
    },
    // New features
    selectedCity,
    setSelectedCity: (city: string) => {
      setSelectedCity(city);
      localStorage.setItem('user-selected-city', city);
      const lat = location?.lat ?? 36.19;
      const lng = location?.lng ?? 44.01;
      fetchMobilePrayerTimes(lat, lng, city);
    },
    availableCities: Object.keys(prayerDataDB).sort()
  };
}
