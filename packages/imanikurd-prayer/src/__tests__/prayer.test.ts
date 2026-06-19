import { describe, it, expect } from "vitest";
import {
  getPrayerCities,
  getPrayerTimes,
  getDailyPrayerRecord,
  getMonthlyPrayerTimes,
  getCityFromCoordinates,
  getNextPrayer,
  getPrayerTimesAsync,
} from "../prayer.js";

describe("Prayer Times and Cities", () => {
  it("should retrieve list of prayer cities", () => {
    const cities = getPrayerCities();
    expect(cities).toContain("Hawler");
    expect(cities).toContain("Slemani");
    expect(cities.length).toBeGreaterThanOrEqual(14);
  });

  it("should get daily prayer times for Erbil (Hawler)", () => {
    const times = getPrayerTimes("Hawler", new Date(2026, 5, 19)); // June 19, 2026
    expect(times).not.toBeNull();
    if (times) {
      expect(times.Fajr).toBeDefined();
      expect(times.Sunrise).toBeDefined();
      expect(times.Dhuhr).toBeDefined();
      expect(times.Asr).toBeDefined();
      expect(times.Maghrib).toBeDefined();
      expect(times.Isha).toBeDefined();
    }
  });

  it("should fetch prayer times asynchronously", async () => {
    const times = await getPrayerTimesAsync("Hawler", new Date(2026, 5, 19));
    expect(times).not.toBeNull();
    expect(times?.Fajr).toBeDefined();
  });

  it("should get daily prayer record including date", () => {
    const record = getDailyPrayerRecord("Slemani", new Date(2026, 5, 19));
    expect(record).not.toBeNull();
    expect(record?.date).toBe("06-19");
    expect(record?.timings.Fajr).toBeDefined();
  });

  it("should get monthly prayer times list", () => {
    const records = getMonthlyPrayerTimes("Hawler", 6, 2026);
    expect(records.length).toBe(30); // June has 30 days
    expect(records[0].day).toBe(1);
    expect(records[29].day).toBe(30);
  });

  it("should find nearest city from coordinates", () => {
    // Erbil coordinates
    const city = getCityFromCoordinates(36.19, 44.01);
    expect(city).toBe("Hawler");

    // Sulaymaniyah coordinates
    const city2 = getCityFromCoordinates(35.56, 45.43);
    expect(city2).toBe("Slemani");
  });

  it("should calculate next upcoming prayer info", () => {
    // Since this uses new Date() by default, we can test that it returns a valid prayer or fallback
    const next = getNextPrayer("Hawler");
    expect(next).not.toBeNull();
    expect(["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"]).toContain(next?.name);
  });
});
