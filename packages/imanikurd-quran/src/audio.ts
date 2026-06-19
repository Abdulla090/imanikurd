import type { Qari } from "./types.js";

/** Available Quran reciters with audio URL generators */
export const QARI_OPTIONS: Qari[] = [
  {
    id: "peshawa",
    name: "پێشەوا قادر (کوردی)",
    nameAr: "Peshawa Qadir",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://media.githubusercontent.com/media/w-coding/Peshawa-Qadir/main/mp3%20files/${padded}.mp3`;
    },
  },
  {
    id: "alafasy",
    name: "مشاری العفاسی",
    nameAr: "Mishary Alafasy",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server8.mp3quran.net/afs/${padded}.mp3`;
    },
  },
  {
    id: "husary",
    name: "محمود خلیل الحصری",
    nameAr: "Mahmoud Al-Husary",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server7.mp3quran.net/husr/${padded}.mp3`;
    },
  },
  {
    id: "minshawi",
    name: "محمد صدیق المنشاوی",
    nameAr: "Al-Minshawi",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server10.mp3quran.net/minsh/${padded}.mp3`;
    },
  },
  {
    id: "abdulbasit",
    name: "عبدالباسط عبدالصمد",
    nameAr: "Abdul Basit",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server7.mp3quran.net/basit/${padded}.mp3`;
    },
  },
  {
    id: "sudais",
    name: "عبدالرحمن السدیس",
    nameAr: "Abdulrahman Al-Sudais",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server11.mp3quran.net/sds/${padded}.mp3`;
    },
  },
  {
    id: "shuraim",
    name: "سعود الشریم",
    nameAr: "Saud Al-Shuraim",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server7.mp3quran.net/shur/${padded}.mp3`;
    },
  },
  {
    id: "maher",
    name: "ماهر المعیقلی",
    nameAr: "Maher Al-Muaiqly",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server12.mp3quran.net/maher/${padded}.mp3`;
    },
  },
  {
    id: "ghamdi",
    name: "سعد الغامدی",
    nameAr: "Saad Al-Ghamdi",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server7.mp3quran.net/s_gmd/${padded}.mp3`;
    },
  },
  {
    id: "ajamy",
    name: "أحمد العجمی",
    nameAr: "Ahmed Al-Ajmi",
    getUrl: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, "0");
      return `https://server10.mp3quran.net/ajm/${padded}.mp3`;
    },
  },
];

/** Get all available reciters */
export function getQariOptions(): Qari[] {
  return QARI_OPTIONS;
}

/** Get recitation URL for a surah by qari id */
export function getRecitationUrl(qariId: string, surahNumber: number): string | undefined {
  const qari = QARI_OPTIONS.find((q) => q.id === qariId);
  return qari?.getUrl(surahNumber);
}

/** Get a reciter by id */
export function getQari(qariId: string): Qari | undefined {
  return QARI_OPTIONS.find((q) => q.id === qariId);
}

export type { Qari };
