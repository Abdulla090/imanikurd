import type { City } from "./types.js";

/** Kurdistan region cities with coordinates for prayer times and Qibla */
export const KURDISTAN_CITIES: City[] = [
  { key: "Hawler", name: "Erbil", nameKurdish: "هەولێر", lat: 36.19, lng: 44.01, radius: 0.4 },
  { key: "Slemani", name: "Sulaymaniyah", nameKurdish: "سلێمانی", lat: 35.56, lng: 45.44, radius: 0.4 },
  { key: "Duhok", name: "Duhok", nameKurdish: "دهۆک", lat: 36.87, lng: 42.99, radius: 0.4 },
  { key: "Kirkuk", name: "Kirkuk", nameKurdish: "کەرکوک", lat: 35.47, lng: 44.39, radius: 0.4 },
  { key: "Zakho", name: "Zakho", nameKurdish: "زاخۆ", lat: 37.15, lng: 42.68, radius: 0.3 },
  { key: "Halabja", name: "Halabja", nameKurdish: "ھەڵەبجە", lat: 35.18, lng: 45.98, radius: 0.3 },
  { key: "Koya", name: "Koya", nameKurdish: "کۆیە", lat: 36.08, lng: 44.63, radius: 0.3 },
  { key: "Akre", name: "Akre", nameKurdish: "ئاکرێ", lat: 36.74, lng: 43.88, radius: 0.3 },
  { key: "Qaladze", name: "Qaladze", nameKurdish: "قەڵادزێ", lat: 36.18, lng: 45.11, radius: 0.3 },
  { key: "Darbandikhan", name: "Darbandikhan", nameKurdish: "دەربەندیخان", lat: 35.11, lng: 45.69, radius: 0.3 },
  { key: "Soran", name: "Soran", nameKurdish: "سۆران", lat: 36.65, lng: 44.54, radius: 0.3 },
  { key: "Choman", name: "Choman", nameKurdish: "چۆمان", lat: 36.63, lng: 44.89, radius: 0.3 },
  { key: "Penjwin", name: "Penjwin", nameKurdish: "پێنجوێن", lat: 35.62, lng: 45.94, radius: 0.3 },
  { key: "Shaqlawa", name: "Shaqlawa", nameKurdish: "شەقڵاوە", lat: 36.4, lng: 44.32, radius: 0.3 },
  { key: "Rawanduz", name: "Rawanduz", nameKurdish: "ڕەواندز", lat: 36.61, lng: 44.52, radius: 0.3 },
  { key: "Ranya", name: "Ranya", nameKurdish: "ڕانیە", lat: 36.25, lng: 44.88, radius: 0.3 },
  { key: "Kifri", name: "Kifri", nameKurdish: "کفری", lat: 34.69, lng: 44.96, radius: 0.3 },
  { key: "Chamchamal", name: "Chamchamal", nameKurdish: "چەمچەماڵ", lat: 35.53, lng: 44.83, radius: 0.3 },
  { key: "Kalar", name: "Kalar", nameKurdish: "کەلار", lat: 34.63, lng: 45.32, radius: 0.3 },
  { key: "Baghdad", name: "Baghdad", nameKurdish: "بەغدا", lat: 33.31, lng: 44.36, radius: 0.5 },
  { key: "Mosul", name: "Mosul", nameKurdish: "موسڵ", lat: 36.34, lng: 43.13, radius: 0.5 },
  { key: "Basra", name: "Basra", nameKurdish: "بەسرە", lat: 30.5, lng: 47.81, radius: 0.5 },
];

const CITY_DISPLAY: Record<string, string> = Object.fromEntries(
  KURDISTAN_CITIES.map((c) => [c.key, c.nameKurdish])
);

/** Find the nearest city by coordinates */
export function getCityByCoordinates(lat: number, lng: number): City {
  let closest = KURDISTAN_CITIES[KURDISTAN_CITIES.length - 1];
  let minDistance = Infinity;

  for (const city of KURDISTAN_CITIES) {
    const distance = Math.sqrt((lat - city.lat) ** 2 + (lng - city.lng) ** 2);
    if (distance <= city.radius && distance < minDistance) {
      minDistance = distance;
      closest = city;
    }
  }

  if (minDistance === Infinity) {
    return KURDISTAN_CITIES.find((c) => c.key === "Hawler")!;
  }

  return closest;
}

/** Get Kurdish display name for a city key */
export function getCityDisplayName(cityKey: string): string {
  return CITY_DISPLAY[cityKey] || cityKey;
}

/** Get city metadata by key */
export function getCity(cityKey: string): City | undefined {
  return KURDISTAN_CITIES.find((c) => c.key === cityKey);
}

export type { City };
