

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Loader2, Search, Languages, Copy, Share2, Settings, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface AyahWithTranslation {
  number: number;
  text: string;
  numberInSurah: number;
  translation: string;
  tafsir?: string;
}

interface TafsirData {
  [surahNum: number]: {
    [ayahNum: number]: string;
  };
}

// Available Tafsirs from Noor Database (IDs must match actual filenames in public/data/)
const TAFSIR_OPTIONS = [
  { id: "rebar", name: "تەفسیری ڕێبەر" },
  { id: "asan", name: "تەفسیری ئاسان" },
  { id: "puxta", name: "تەفسیری پوختە" },
  { id: "raman", name: "تەفسیری ڕامان" },
  { id: "hazhar", name: "تەفسیری هەژار (مامۆستا هەژار)" },
  { id: "zhin", name: "تەفسیری ژیان" },
  { id: "sanahi", name: "تەفسیری سەناهی" },
  { id: "maisar", name: "تەفسیری مویەسەر" },
  { id: "tawhid", name: "تەفسیری تەوحیدی" },
  { id: "roshn", name: "تەفسیری ڕۆشن" },
  { id: "runahi", name: "تەفسیری ڕوناهی" },
  { id: "mokhtasar", name: "تەفسیری موختەسەر" },
  { id: "krd", name: "تەفسیری کوردی" }
];

// Available Quran Reciters (Qaris)
interface Qari {
  id: string;
  name: string;
  nameAr: string;
  getUrl: (surahNum: number) => string;
}

const QARI_OPTIONS: Qari[] = [
  {
    id: "peshawa",
    name: "پێشەوا قادر (کوردی)",
    nameAr: "Peshawa Qadir",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      // GitHub LFS raw URL
      return `https://media.githubusercontent.com/media/w-coding/Peshawa-Qadir/main/mp3%20files/${paddedNum}.mp3`;
    }
  },
  {
    id: "alafasy",
    name: "مشاری العفاسی",
    nameAr: "Mishary Alafasy",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server8.mp3quran.net/afs/${paddedNum}.mp3`;
    }
  },
  {
    id: "husary",
    name: "محمود خلیل الحصری",
    nameAr: "Mahmoud Al-Husary",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/husr/${paddedNum}.mp3`;
    }
  },
  {
    id: "minshawi",
    name: "محمد صدیق المنشاوی",
    nameAr: "Al-Minshawi",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server10.mp3quran.net/minsh/${paddedNum}.mp3`;
    }
  },
  {
    id: "abdulbasit",
    name: "عبدالباسط عبدالصمد",
    nameAr: "Abdul Basit",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/basit/${paddedNum}.mp3`;
    }
  },
  {
    id: "sudais",
    name: "عبدالرحمن السدیس",
    nameAr: "Abdulrahman Al-Sudais",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server11.mp3quran.net/sds/${paddedNum}.mp3`;
    }
  },
  {
    id: "shuraim",
    name: "سعود الشریم",
    nameAr: "Saud Al-Shuraim",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/shur/${paddedNum}.mp3`;
    }
  },
  {
    id: "maher",
    name: "ماهر المعیقلی",
    nameAr: "Maher Al-Muaiqly",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server12.mp3quran.net/maher/${paddedNum}.mp3`;
    }
  },
  {
    id: "ghamdi",
    name: "سعد الغامدی",
    nameAr: "Saad Al-Ghamdi",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/s_gmd/${paddedNum}.mp3`;
    }
  },
  {
    id: "ajamy",
    name: "أحمد العجمی",
    nameAr: "Ahmed Al-Ajmi",
    getUrl: (surahNum: number) => {
      const paddedNum = surahNum.toString().padStart(3, '0');
      return `https://server10.mp3quran.net/ajm/${paddedNum}.mp3`;
    }
  }
];

// Static surah list as fallback
const SURAHS_DATA: Surah[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "البقرة", englishName: "Al-Baqara", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 3, name: "آل عمران", englishName: "Aal-i-Imran", englishNameTranslation: "The Family of Imran", numberOfAyahs: 200, revelationType: "Medinan" },
  { number: 4, name: "النساء", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, name: "المائدة", englishName: "Al-Ma'ida", englishNameTranslation: "The Table", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, name: "التوبة", englishName: "At-Tawba", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan" },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan" },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan" },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, name: "طه", englishName: "Ta-Ha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan" },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan" },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan" },
  { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan" },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan" },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan" },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ants", numberOfAyahs: 93, revelationType: "Meccan" },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 29, name: "العنكبوت", englishName: "Al-Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan" },
  { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan" },
  { number: 32, name: "السجدة", englishName: "As-Sajda", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Clans", numberOfAyahs: 73, revelationType: "Medinan" },
  { number: 34, name: "سبأ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "The Originator", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya-Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those Ranged in Ranks", numberOfAyahs: 182, revelationType: "Meccan" },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "Sad", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Groups", numberOfAyahs: 75, revelationType: "Meccan" },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan" },
  { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan" },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Gold", numberOfAyahs: 89, revelationType: "Meccan" },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan" },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiya", englishNameTranslation: "The Kneeling", numberOfAyahs: 37, revelationType: "Meccan" },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Dunes", numberOfAyahs: 35, revelationType: "Meccan" },
  { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan" },
  { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 50, name: "ق", englishName: "Qaf", englishNameTranslation: "Qaf", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 52, name: "الطور", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan" },
  { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan" },
  { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Most Gracious", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'a", englishNameTranslation: "The Event", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadila", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan" },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Gathering", numberOfAyahs: 24, revelationType: "Medinan" },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahina", englishNameTranslation: "The Examined One", numberOfAyahs: 13, revelationType: "Medinan" },
  { number: 61, name: "الصف", englishName: "As-Saff", englishNameTranslation: "The Row", numberOfAyahs: 14, revelationType: "Medinan" },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'a", englishNameTranslation: "Friday", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan" },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", englishNameTranslation: "Loss and Gain", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Kingdom", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqa", englishNameTranslation: "The Inevitable", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", englishNameTranslation: "The Ways of Ascent", numberOfAyahs: 44, revelationType: "Meccan" },
  { number: 71, name: "نوح", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Wrapped", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 74, name: "المدثر", englishName: "Al-Muddathir", englishNameTranslation: "The Cloaked", numberOfAyahs: 56, revelationType: "Meccan" },
  { number: 75, name: "القيامة", englishName: "Al-Qiyama", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 76, name: "الإنسان", englishName: "Al-Insan", englishNameTranslation: "Man", numberOfAyahs: 31, revelationType: "Medinan" },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", englishNameTranslation: "Those Sent Forth", numberOfAyahs: 50, revelationType: "Meccan" },
  { number: 78, name: "النبأ", englishName: "An-Naba", englishNameTranslation: "The Great News", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", englishNameTranslation: "Those Who Pull Out", numberOfAyahs: 46, revelationType: "Meccan" },
  { number: 80, name: "عبس", englishName: "Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan" },
  { number: 81, name: "التكوير", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan" },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauders", numberOfAyahs: 36, revelationType: "Meccan" },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", englishNameTranslation: "The Splitting", numberOfAyahs: 25, revelationType: "Meccan" },
  { number: 85, name: "البروج", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan" },
  { number: 86, name: "الطارق", englishName: "At-Tariq", englishNameTranslation: "The Night-Comer", numberOfAyahs: 17, revelationType: "Meccan" },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiya", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan" },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan" },
  { number: 92, name: "الليل", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan" },
  { number: 93, name: "الضحى", englishName: "Ad-Duha", englishNameTranslation: "The Forenoon", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Opening Forth", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 95, name: "التين", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 96, name: "العلق", englishName: "Al-Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Night of Decree", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 98, name: "البينة", englishName: "Al-Bayyina", englishNameTranslation: "The Clear Evidence", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzala", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 100, name: "العاديات", englishName: "Al-Adiyat", englishNameTranslation: "The Runners", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 101, name: "القارعة", englishName: "Al-Qari'a", englishNameTranslation: "The Striking Hour", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", englishNameTranslation: "Competition", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 103, name: "العصر", englishName: "Al-Asr", englishNameTranslation: "The Time", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 104, name: "الهمزة", englishName: "Al-Humaza", englishNameTranslation: "The Slanderer", numberOfAyahs: 9, revelationType: "Meccan" },
  { number: 105, name: "الفيل", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", englishNameTranslation: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "Abundance", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan" },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Help", numberOfAyahs: 3, revelationType: "Medinan" },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" },
];

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>(SURAHS_DATA);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<AyahWithTranslation[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSurahList, setShowSurahList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTafsir, setShowTafsir] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [tafsirData, setTafsirData] = useState<TafsirData>({});
  const [tafsirLoaded, setTafsirLoaded] = useState(false);
  const [selectedTafsir, setSelectedTafsir] = useState("rebar"); // Default tafsir
  const [menuOpen, setMenuOpen] = useState(false);

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [loadedSurahNum, setLoadedSurahNum] = useState<number | null>(null);
  const [selectedQari, setSelectedQari] = useState<Qari>(QARI_OPTIONS[0]); // Default: Peshawa Qadir
  const [loadedQariId, setLoadedQariId] = useState<string | null>(null);

  // Get audio URL for surah using selected qari
  const getAudioUrl = (surahNum: number) => {
    return selectedQari.getUrl(surahNum);
  };

  // Load audio with direct URL
  const loadAudio = async (surahNum: number, qariId: string): Promise<boolean> => {
    if (!audioRef.current) return false;

    // If already loaded this surah with same qari, just return true
    if (loadedSurahNum === surahNum && loadedQariId === qariId && audioRef.current.readyState >= 2) {
      return true;
    }

    setAudioLoading(true);

    return new Promise<boolean>((resolve) => {
      const audio = audioRef.current;
      if (!audio) {
        setAudioLoading(false);
        resolve(false);
        return;
      }

      const onCanPlay = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        setLoadedSurahNum(surahNum);
        setLoadedQariId(qariId);
        setAudioLoading(false);
        resolve(true);
      };

      const onError = (e: Event) => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        console.error('Audio load error:', e);
        toast.error('هەڵەیەک ڕوویدا لە بارکردنی دەنگ');
        setAudioLoading(false);
        resolve(false);
      };

      audio.addEventListener('canplaythrough', onCanPlay);
      audio.addEventListener('error', onError);

      // Set the source directly (works better than blob for seeking)
      audio.src = getAudioUrl(surahNum);
      audio.load();
    });
  };

  // Audio controls
  const togglePlay = async () => {
    if (!audioRef.current || !selectedSurah) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Load audio if not loaded or if qari changed
      if (loadedSurahNum !== selectedSurah.number || loadedQariId !== selectedQari.id) {
        const success = await loadAudio(selectedSurah.number, selectedQari.id);
        if (!success) return;
      }

      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback failed:', err);
        toast.error('نەتوانرا دەنگ لێبدرێت');
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setAudioCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  // Reset audio state when surah changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioCurrentTime(0);
    setAudioProgress(0);
    setAudioDuration(0);
    setLoadedSurahNum(null);
    setLoadedQariId(null);
  }, [selectedSurah]);

  // Reset audio when qari changes
  useEffect(() => {
    setAudioCurrentTime(0);
    setAudioProgress(0);
    setAudioDuration(0);
    setLoadedQariId(null);
    setLoadedSurahNum(null);
  }, [selectedQari]);

  // Audio event handlers - re-attach when source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isNaN(audio.currentTime) && !isNaN(audio.duration) && audio.duration > 0) {
        setAudioCurrentTime(audio.currentTime);
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleDurationChange = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
      setAudioCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [loadedSurahNum]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSurahList || loading) return;

      if (e.key === "ArrowLeft" && currentAyahIndex < ayahs.length - 1) {
        setCurrentAyahIndex(prev => prev + 1);
      } else if (e.key === "ArrowRight" && currentAyahIndex > 0) {
        setCurrentAyahIndex(prev => prev - 1);
      } else if (e.key === "Escape") {
        setShowSurahList(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSurahList, loading, currentAyahIndex, ayahs.length]);

  // Load selected tafsir JSON
  const loadTafsirJSON = async (tafsirId: string) => {
    try {
      setTafsirLoaded(false);
      const response = await fetch(`/data/tafsir_${tafsirId}.json`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const rawData = await response.json();

      // Transform array [{s,a,t}] to map {s:{a:t}}
      // Note: 's' is a string in the JSON, so we parse it
      const parsedData: TafsirData = {};
      rawData.forEach((item: { s: string | number; a: number; t: string }) => {
        const surahNum = typeof item.s === 'string' ? parseInt(item.s, 10) : item.s;
        if (!parsedData[surahNum]) parsedData[surahNum] = {};
        parsedData[surahNum][item.a] = item.t;
      });

      setTafsirData(parsedData);
      setTafsirLoaded(true);
      toast.success("تەفسیر بارکرا", {
        description: TAFSIR_OPTIONS.find(t => t.id === tafsirId)?.name,
        duration: 1000
      });

      // Save preference
      localStorage.setItem("selected-tafsir-id", tafsirId);

    } catch (err) {
      console.error("Failed to load tafsir:", err);
      toast.error("هەڵە لە بارکردنی تەفسیر");
    }
  };


  useEffect(() => {
    const saved = localStorage.getItem("selected-tafsir-id");
    // Validate that saved ID exists in options, otherwise use default
    const validIds = TAFSIR_OPTIONS.map(t => t.id);
    const validSaved = saved && validIds.includes(saved) ? saved : "rebar";

    if (validSaved !== saved) {
      // Clear invalid saved preference
      localStorage.removeItem("selected-tafsir-id");
    }

    setSelectedTafsir(validSaved);
    loadTafsirJSON(validSaved);

    // Fetch Surahs API check
    fetchSurahs();
  }, []); // Only on mount

  // Watch for tafsir change - but skip initial mount (handled above)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    loadTafsirJSON(selectedTafsir);
  }, [selectedTafsir]);

  const fetchSurahs = async () => {
    try {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      if (data.code === 200) {
        setSurahs(data.data);
      }
    } catch (err) {
      // Fallback to static
    }
  };

  const handleSelectSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setShowSurahList(false);
    setLoading(true);
    setCurrentAyahIndex(0);

    try {
      // Fetch Arabic from reliable API
      const arabicRes = await fetch(
        `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surah.number}`
      );
      const arabicData = await arabicRes.json();

      if (arabicData?.verses?.length > 0) {
        const combined = arabicData.verses.map((verse: any) => {
          const ayahNum = parseInt(verse.verse_key.split(':')[1]);
          return {
            number: verse.id,
            numberInSurah: ayahNum,
            text: verse.text_uthmani,
            translation: tafsirData[surah.number]?.[ayahNum] || "تەفسیر بەردەست نییە بۆ ئەم ئایەتە",
          };
        });
        setAyahs(combined);
      } else {
        throw new Error("No verses found");
      }
    } catch (err) {
      // Fallback construction using local data
      const surahTafsir = tafsirData[surah.number] || {};
      const ayahNumbers = Object.keys(surahTafsir).map(Number).sort((a, b) => a - b);
      // If we have no tafsir for this surah yet, create placeholders based on count
      const count = surah.numberOfAyahs;
      const fallback = Array.from({ length: count }, (_, i) => ({
        number: i + 1,
        numberInSurah: i + 1,
        text: `﴿ ${i + 1} ﴾`,
        translation: surahTafsir[i + 1] || ""
      }));
      setAyahs(fallback);
    } finally {
      setLoading(false);
    }
  };

  const currentAyah = ayahs[currentAyahIndex];

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  );

  const copyAyah = (ayah: AyahWithTranslation) => {
    const tafsirText = selectedSurah ? (tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || "") : "";
    const text = `${ayah.text}\n\n${tafsirText}\n\n— ${selectedSurah?.name} (${ayah.numberInSurah})`;
    navigator.clipboard.writeText(text);
    toast.success("کۆپی کرا!");
  };

  const shareAyah = (ayah: AyahWithTranslation) => {
    const tafsirText = selectedSurah ? (tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || "") : "";
    const text = `${ayah.text}\n\n${tafsirText}\n\n— ${selectedSurah?.name} (${ayah.numberInSurah})`;
    if (navigator.share) {
      navigator.share({
        title: `Quran: ${selectedSurah?.name}`,
        text: text
      });
    } else {
      copyAyah(ayah);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GeometricPattern />
      <Navigation />

      <main className="relative z-10 pt-20 sm:pt-24 pb-32 sm:pb-40 px-2 sm:px-4 md:px-6">
        <div className="w-full max-w-5xl mx-auto">
          {showSurahList ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="گەڕان بۆ سورەت..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 h-10"
                  />
                </div>

                {/* Tafsir Selector */}
                <Select value={selectedTafsir} onValueChange={setSelectedTafsir}>
                  <SelectTrigger className="w-full sm:w-[200px] h-10">
                    <SelectValue placeholder="تەفسیر هەڵبژێرە" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAFSIR_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold">114 سورە</span>
                {tafsirLoaded && (
                  <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded-lg">✓ {TAFSIR_OPTIONS.find(t => t.id === selectedTafsir)?.name}</span>
                )}
              </div>

              {/* Surah List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-[75vh] overflow-y-auto scrollbar-thin p-1">
                {filteredSurahs.map((surah, index) => (
                  <motion.button
                    key={surah.number}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.005 }}
                    onClick={() => handleSelectSurah(surah)}
                    className="feature-card flex items-center gap-3 p-3 sm:p-4 text-right hover:border-primary/50 transition-all"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 font-arabic text-sm">
                      {surah.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-arabic text-base sm:text-lg text-foreground truncate">{surah.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{surah.numberOfAyahs} ئایەت</span>
                        <span>•</span>
                        <span className={surah.revelationType === "Meccan" ? "text-amber-600" : "text-emerald-600"}>
                          {surah.revelationType === "Meccan" ? "مەککی" : "مەدەنی"}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div>
              {/* Reading View Controls */}
              <div className="flex items-center justify-between mb-4 gap-4 flex-wrap sticky top-20 z-20 bg-background/80 backdrop-blur pb-2">
                <Button variant="ghost" onClick={() => setShowSurahList(true)} className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  لیست
                </Button>

                <div className="flex items-center gap-2">
                  <Select value={selectedTafsir} onValueChange={setSelectedTafsir}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAFSIR_OPTIONS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id} className="text-xs">{opt.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant={viewMode === "card" ? "default" : "outline"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("card")}
                  >
                    کارت
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("list")}
                  >
                    لیست
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Card View */}
                  {viewMode === "card" && currentAyah && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentAyahIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="ayat-container"
                      >
                        {/* Surah Header info */}
                        <div className="text-center mb-6">
                          <h2 className="font-arabic text-2xl text-primary">{selectedSurah?.name}</h2>
                          <div className="text-xs text-muted-foreground mt-1">ئایەت {currentAyah.numberInSurah} لە {ayahs.length}</div>
                        </div>

                        {/* Bismillah */}
                        {currentAyahIndex === 0 && selectedSurah?.number !== 1 && selectedSurah?.number !== 9 && (
                          <div className="text-center mb-8 font-arabic text-xl text-primary/80">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </div>
                        )}

                        <div className="text-center mb-8">
                          <p className="font-arabic text-3xl md:text-4xl leading-[2.5] text-foreground">
                            {currentAyah.text}
                          </p>
                        </div>

                        {showTafsir && (
                          <div className="bg-muted/30 p-4 rounded-2xl text-center border border-border/50">
                            <div className="text-xs text-primary mb-2 font-bold">{TAFSIR_OPTIONS.find(t => t.id === selectedTafsir)?.name}</div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                              {selectedSurah && tafsirData[selectedSurah.number]?.[currentAyah.numberInSurah] || "تەفسیر بەردەست نییە بۆ ئەم ئایەتە"}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-center gap-3 mt-6">
                          <Button variant="outline" size="sm" onClick={() => copyAyah(currentAyah)}>
                            <Copy className="w-4 h-4 mr-2" /> کۆپی
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => shareAyah(currentAyah)}>
                            <Share2 className="w-4 h-4 mr-2" /> هاوبەشی
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* List View */}
                  {viewMode === "list" && (
                    <div className="space-y-6 pb-48">
                      {ayahs.map((ayah, i) => (
                        <div key={ayah.number} className="feature-card p-4 relative group">
                          <div className="absolute top-4 left-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {ayah.numberInSurah}
                          </div>
                          <p className="font-arabic text-2xl leading-loose text-right mt-6 mb-4">{ayah.text}</p>
                          {showTafsir && (
                            <p className="text-muted-foreground leading-relaxed border-r-2 border-primary/20 pr-3 mr-1">
                              {selectedSurah && tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || ""}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer with Audio Player (Both Views) */}
                  <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50">
                    {/* Audio Element - No direct src to bypass IDM */}
                    <audio ref={audioRef} preload="none" crossOrigin="anonymous" />

                    {/* Audio Player Bar */}
                    <div className="px-4 py-2 border-b border-border/50">
                      <div className="max-w-2xl mx-auto">
                        {/* Reciter Selector and Time */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              {audioLoading ? (
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                              ) : (
                                <Volume2 className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            {/* Qari Selector Dropdown */}
                            <Select
                              value={selectedQari.id}
                              onValueChange={(val) => {
                                const qari = QARI_OPTIONS.find(q => q.id === val);
                                if (qari) {
                                  setSelectedQari(qari);
                                  // Stop current playback when changing reciter
                                  if (audioRef.current) {
                                    audioRef.current.pause();
                                    setIsPlaying(false);
                                  }
                                }
                              }}
                            >
                              <SelectTrigger className="w-[160px] h-8 text-xs bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {QARI_OPTIONS.map((qari) => (
                                  <SelectItem key={qari.id} value={qari.id} className="text-xs">
                                    <div className="flex flex-col">
                                      <span>{qari.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                            <span>{formatTime(audioCurrentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(audioDuration)}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <input
                          type="range"
                          min="0"
                          max={audioDuration || 100}
                          value={audioCurrentTime}
                          onChange={seekAudio}
                          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                        />

                        {/* Audio Controls */}
                        <div className="flex items-center justify-center gap-4 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={toggleMute}
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              if (audioRef.current) {
                                audioRef.current.currentTime = 0;
                                setAudioCurrentTime(0);
                              }
                            }}
                          >
                            <SkipBack className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="default"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={togglePlay}
                            disabled={audioLoading}
                          >
                            {audioLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </Button>

                          {/* Download Button */}
                          <a
                            href={selectedSurah ? getAudioUrl(selectedSurah.number) : '#'}
                            download={selectedSurah ? `${selectedSurah.number.toString().padStart(3, '0')}_${selectedSurah.englishName}.mp3` : 'surah.mp3'}
                            className="inline-flex"
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              title="داونلۆد"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Ayah Navigation (Card Mode only) */}
                    {viewMode === "card" && (
                      <div className="px-4 py-3">
                        <div className="max-w-md mx-auto flex items-center gap-4">
                          <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setCurrentAyahIndex(p => Math.max(0, p - 1))}
                            disabled={currentAyahIndex === 0}
                          >
                            <ChevronRight className="w-5 h-5 ml-1" /> پێشوو
                          </Button>

                          <span className="text-sm font-mono opacity-50">{currentAyahIndex + 1} / {ayahs.length}</span>

                          <Button
                            variant="default"
                            className="flex-1"
                            onClick={() => setCurrentAyahIndex(p => Math.min(ayahs.length - 1, p + 1))}
                            disabled={currentAyahIndex === ayahs.length - 1}
                          >
                            دواتر <ChevronLeft className="w-5 h-5 mr-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
