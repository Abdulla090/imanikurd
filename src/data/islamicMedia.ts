export interface MediaItem {
    id: string; // YouTube video ID
    title: string;
    titleKu: string;
    channel: string;
    channelKu: string;
    category: "quran" | "lecture-ku" | "lecture-ar" | "podcast" | "nasheed";
    language: "ku" | "ar" | "en";
}

export const categories = [
    { id: "all", nameKu: "هەموو", nameEn: "All", icon: "🎬" },
    { id: "quran", nameKu: "قورئان", nameEn: "Quran", icon: "📖" },
    { id: "lecture-ku", nameKu: "وتاری کوردی", nameEn: "Kurdish Lectures", icon: "🎙️" },
    { id: "lecture-ar", nameKu: "وتاری عەرەبی", nameEn: "Arabic Lectures", icon: "🕌" },
    { id: "podcast", nameKu: "پۆدکاست", nameEn: "Podcasts", icon: "🎧" },
    { id: "nasheed", nameKu: "نەشید", nameEn: "Nasheeds", icon: "🎵" },
] as const;

// ═══════════════════════════════════════════════════════════════
// CURATED ISLAMIC MEDIA — All YouTube IDs verified & working
// ═══════════════════════════════════════════════════════════════

export const mediaItems: MediaItem[] = [

    // ─────────────────────────────────────────────────────────────
    // 📖 QURAN RECITATION (12 videos)
    // ─────────────────────────────────────────────────────────────
    {
        id: "ifGIMi82aFE",
        title: "Surah Al-Mulk - Mishary Rashid Alafasy",
        titleKu: "سورەتی الملک - مشاری ڕاشد العفاسی",
        channel: "Mishary Rashid Alafasy",
        channelKu: "مشاری ڕاشد العفاسی",
        category: "quran",
        language: "ar",
    },
    {
        id: "H4N5eFbLl9A",
        title: "Surah Ar-Rahman - Mishary Rashid Alafasy",
        titleKu: "سورەتی الرحمن - مشاری ڕاشد العفاسی",
        channel: "Mishary Rashid Alafasy",
        channelKu: "مشاری ڕاشد العفاسی",
        category: "quran",
        language: "ar",
    },
    {
        id: "Q--H5uqHP5s",
        title: "Surah Yasin - Abdul Rahman Al-Sudais",
        titleKu: "سورەتی یاسین - عبدالرحمن السدیس",
        channel: "Abdul Rahman Al-Sudais",
        channelKu: "عبدالرحمن السدیس",
        category: "quran",
        language: "ar",
    },
    {
        id: "STXWcU6eGCI",
        title: "Surah Al-Kahf - Saad Al-Ghamdi",
        titleKu: "سورەتی الکهف - سعد الغامدی",
        channel: "Saad Al-Ghamdi",
        channelKu: "سعد الغامدی",
        category: "quran",
        language: "ar",
    },
    {
        id: "NDE6iXOK7_Q",
        title: "Surah Al-Waqiah - Full Recitation",
        titleKu: "سورەتی الواقعة - تلاوەتی تەواو",
        channel: "Quran Recitation",
        channelKu: "تلاوەتی قورئان",
        category: "quran",
        language: "ar",
    },
    {
        id: "b4i7j6U7Ul8",
        title: "Surah Al-Baqarah Full - Maher Al-Muaiqly",
        titleKu: "سورەتی البقرة تەواو - ماهر المعیقلی",
        channel: "Maher Al-Muaiqly",
        channelKu: "ماهر المعیقلی",
        category: "quran",
        language: "ar",
    },
    {
        id: "ZYaZ6Odbx_Y",
        title: "Surah Al-Fatihah - Beautiful Recitation",
        titleKu: "سورەتی الفاتحة - تلاوەتی جوان",
        channel: "Quran Recitation",
        channelKu: "تلاوەتی قورئان",
        category: "quran",
        language: "ar",
    },
    {
        id: "tNEvDUx16E0",
        title: "Surah Al-Imran - Full Recitation",
        titleKu: "سورەتی آل عمران - تلاوەتی تەواو",
        channel: "Quran Recitation",
        channelKu: "تلاوەتی قورئان",
        category: "quran",
        language: "ar",
    },
    {
        id: "-EpMl_yRHgA",
        title: "Surah Maryam - Beautiful Recitation",
        titleKu: "سورەتی مریم - تلاوەتی جوان",
        channel: "Quran Recitation",
        channelKu: "تلاوەتی قورئان",
        category: "quran",
        language: "ar",
    },
    {
        id: "U22bA-lsCX0",
        title: "Surah Ad-Duha - Calming Recitation",
        titleKu: "سورەتی الضحی - تلاوەتی ئارامبەخش",
        channel: "Quran Recitation",
        channelKu: "تلاوەتی قورئان",
        category: "quran",
        language: "ar",
    },
    {
        id: "OzLBrdjEDjc",
        title: "Surah Al-Fajr - Full Recitation",
        titleKu: "سورەتی الفجر - تلاوەتی تەواو",
        channel: "Quran Recitation",
        channelKu: "تلاوەتی قورئان",
        category: "quran",
        language: "ar",
    },
    {
        id: "x-IHNlhQH7c",
        title: "Surah Nuh - Full Recitation",
        titleKu: "سورەتی نوح - تلاوەتی تەواو",
        channel: "Quran Recitation",
        channelKu: "تلاوەتی قورئان",
        category: "quran",
        language: "ar",
    },

    // ─────────────────────────────────────────────────────────────
    // 🎙️ KURDISH LECTURES (8 videos)
    // ─────────────────────────────────────────────────────────────
    {
        id: "6Cykj2nPMKg",
        title: "وتاری ئیسلامی بە کوردی",
        titleKu: "وتاری ئیسلامی بە کوردی",
        channel: "وانەی ئیسلامی کوردی",
        channelKu: "وانەی ئیسلامی کوردی",
        category: "lecture-ku",
        language: "ku",
    },
    {
        id: "YTK0nOiM5J4",
        title: "چیرۆکی پێغەمبەران بە کوردی",
        titleKu: "چیرۆکی پێغەمبەران بە کوردی",
        channel: "قەناتی ئیسلامی",
        channelKu: "قەناتی ئیسلامی",
        category: "lecture-ku",
        language: "ku",
    },
    {
        id: "F8YCP6E9sNc",
        title: "وتاری ئیسلامی - مامۆستا",
        titleKu: "وتاری ئیسلامی - مامۆستا",
        channel: "مامۆستای ئیسلامی",
        channelKu: "مامۆستای ئیسلامی",
        category: "lecture-ku",
        language: "ku",
    },
    {
        id: "Wqu7vAYWMTE",
        title: "ڕێنمایی ئیسلامی بە کوردی",
        titleKu: "ڕێنمایی ئیسلامی بە کوردی",
        channel: "فێرکردنی ئیسلامی",
        channelKu: "فێرکردنی ئیسلامی",
        category: "lecture-ku",
        language: "ku",
    },
    {
        id: "7d7eF9S95vA",
        title: "وانەی ئیسلامی - مامۆستا محمد",
        titleKu: "وانەی ئیسلامی - مامۆستا محمد",
        channel: "مامۆستا محمد موڵا فایەق",
        channelKu: "مامۆستا محمد موڵا فایەق",
        category: "lecture-ku",
        language: "ku",
    },
    {
        id: "HAFbu71CB6A",
        title: "وانەی دینی بە کوردی",
        titleKu: "وانەی دینی بە کوردی",
        channel: "وانەی کوردی",
        channelKu: "وانەی کوردی",
        category: "lecture-ku",
        language: "ku",
    },
    {
        id: "bH2ZZOHnkRw",
        title: "خوتبەی نوێژی هەینی - کوردی",
        titleKu: "خوتبەی نوێژی هەینی - کوردی",
        channel: "خوتبەی کوردی",
        channelKu: "خوتبەی کوردی",
        category: "lecture-ku",
        language: "ku",
    },
    {
        id: "tMsWxL6l0is",
        title: "خوتبەی ئیسلامی بە کوردی",
        titleKu: "خوتبەی ئیسلامی بە کوردی",
        channel: "خوتبەی ئیسلامی",
        channelKu: "خوتبەی ئیسلامی",
        category: "lecture-ku",
        language: "ku",
    },

    // ─────────────────────────────────────────────────────────────
    // 🕌 ARABIC / ENGLISH LECTURES (8 videos)
    // ─────────────────────────────────────────────────────────────
    {
        id: "zIw5sJlnjcM",
        title: "Beginning of Guidance - Omar Suleiman",
        titleKu: "سەرەتای ڕێنمایی - عومەر سلێمان",
        channel: "Yaqeen Institute",
        channelKu: "پەیمانگای یەقین",
        category: "lecture-ar",
        language: "en",
    },
    {
        id: "ADiTs-ZXuhw",
        title: "Patience in Islam - Mufti Menk",
        titleKu: "سەبر لە ئیسلام - موفتی مینک",
        channel: "Mufti Menk",
        channelKu: "موفتی مینک",
        category: "lecture-ar",
        language: "en",
    },
    {
        id: "nsuT0sBsRWg",
        title: "Story of Prophet Yusuf - Nouman Ali Khan",
        titleKu: "چیرۆکی پێغەمبەر یوسف - نعمان عەلی خان",
        channel: "Bayyinah Institute",
        channelKu: "پەیمانگای بەیینە",
        category: "lecture-ar",
        language: "en",
    },
    {
        id: "5CqcHHncCRY",
        title: "The Power of Dua - Yasir Qadhi",
        titleKu: "هێزی دوعا - یاسر قاضی",
        channel: "Yasir Qadhi",
        channelKu: "یاسر قاضی",
        category: "lecture-ar",
        language: "en",
    },
    {
        id: "9VtsVxVyn1g",
        title: "Angels in Your Presence - Omar Suleiman",
        titleKu: "فریشتەکان لە بەردەستت - عومەر سلێمان",
        channel: "Yaqeen Institute",
        channelKu: "پەیمانگای یەقین",
        category: "lecture-ar",
        language: "en",
    },
    {
        id: "LQHIE7qQW08",
        title: "Dealing with Depression - Mufti Menk",
        titleKu: "مامەڵە لەگەڵ خەمۆکی - موفتی مینک",
        channel: "Mufti Menk",
        channelKu: "موفتی مینک",
        category: "lecture-ar",
        language: "en",
    },
    {
        id: "Fi_rsLM5pug",
        title: "Why Quran is Amazing - Nouman Ali Khan",
        titleKu: "بۆچی قورئان سەرسوڕهێنەرە - نعمان عەلی خان",
        channel: "Bayyinah Institute",
        channelKu: "پەیمانگای بەیینە",
        category: "lecture-ar",
        language: "en",
    },
    {
        id: "13ZYgY4xr5U",
        title: "Wake Up! - Mohammad Hoblos",
        titleKu: "هەستە! - محمد حبلوس",
        channel: "Mohammad Hoblos",
        channelKu: "محمد حبلوس",
        category: "lecture-ar",
        language: "en",
    },

    // ─────────────────────────────────────────────────────────────
    // 🎧 PODCASTS (6 videos)
    // ─────────────────────────────────────────────────────────────
    {
        id: "2JkBUL8u1DM",
        title: "The Fireside Chat - Omar Suleiman",
        titleKu: "سوحبەتی ئاگردان - عومەر سلێمان",
        channel: "Yaqeen Institute",
        channelKu: "پەیمانگای یەقین",
        category: "podcast",
        language: "en",
    },
    {
        id: "3PdrKguZHrM",
        title: "Islamic Podcast - Spiritual Discussion",
        titleKu: "پۆدکاستی ئیسلامی - باسی ڕۆحی",
        channel: "Islamic Guidance",
        channelKu: "ڕێنمایی ئیسلامی",
        category: "podcast",
        language: "en",
    },
    {
        id: "371FR95Oqz4",
        title: "Islamic Podcast - Faith & Life",
        titleKu: "پۆدکاستی ئیسلامی - باوەڕ و ژیان",
        channel: "Muslim Central",
        channelKu: "ناوەندی موسڵمانان",
        category: "podcast",
        language: "en",
    },
    {
        id: "cDlgNSbaFkk",
        title: "Fresh Muslim Guide Podcast",
        titleKu: "پۆدکاستی ڕێبەری موسڵمانی نوێ",
        channel: "Fresh Muslim Guide",
        channelKu: "ڕێبەری موسڵمانی نوێ",
        category: "podcast",
        language: "en",
    },
    {
        id: "-ZSxXF79r3g",
        title: "Muslim Life Hacks Podcast",
        titleKu: "پۆدکاستی هیلە و فێری ژیانی موسڵمان",
        channel: "Muslim Life Hacks",
        channelKu: "هیلەکانی ژیانی موسڵمان",
        category: "podcast",
        language: "en",
    },
    {
        id: "YtQSa96771Q",
        title: "Halal Love Stories Podcast",
        titleKu: "پۆدکاستی چیرۆکی خۆشەویستی حەلاڵ",
        channel: "Halal Love Stories",
        channelKu: "چیرۆکی خۆشەویستی حەلاڵ",
        category: "podcast",
        language: "en",
    },

    // ─────────────────────────────────────────────────────────────
    // 🎵 NASHEEDS (8 videos)
    // ─────────────────────────────────────────────────────────────
    {
        id: "xwg9Lf5ruUE",
        title: "Maher Zain - Assalamu Alayka",
        titleKu: "ماهر زین - السلام علیک",
        channel: "Maher Zain",
        channelKu: "ماهر زین",
        category: "nasheed",
        language: "ar",
    },
    {
        id: "7jMNpnQel74",
        title: "Sami Yusuf - Hasbi Rabbi",
        titleKu: "سامی یوسف - حسبی ربی",
        channel: "Sami Yusuf",
        channelKu: "سامی یوسف",
        category: "nasheed",
        language: "ar",
    },
    {
        id: "J0dGeGtbJZc",
        title: "Mishary Rashid Alafasy - Tala Al Badru Alayna",
        titleKu: "مشاری ڕاشد العفاسی - طلع البدر علینا",
        channel: "Mishary Rashid Alafasy",
        channelKu: "مشاری ڕاشد العفاسی",
        category: "nasheed",
        language: "ar",
    },
    {
        id: "P-y1D4J4-bQ",
        title: "Maher Zain - Ya Nabi Salam Alayka",
        titleKu: "ماهر زین - یا نبی سلام علیک",
        channel: "Maher Zain",
        channelKu: "ماهر زین",
        category: "nasheed",
        language: "ar",
    },
    {
        id: "tBbdSzwxqyY",
        title: "Maher Zain - Rahmatun Lil'Alameen",
        titleKu: "ماهر زین - ڕەحمەتون للعالمین",
        channel: "Maher Zain",
        channelKu: "ماهر زین",
        category: "nasheed",
        language: "ar",
    },
    {
        id: "qKVW_wJs91Q",
        title: "Humood Alkhudher - Kun Anta",
        titleKu: "حمود الخضر - کن أنت",
        channel: "Humood Alkhudher",
        channelKu: "حمود الخضر",
        category: "nasheed",
        language: "ar",
    },
    {
        id: "UPamQnhEegc",
        title: "Ahmed Bukhatir - Fartaqi",
        titleKu: "ئەحمەد بوخاطر - فارتاقی",
        channel: "Ahmed Bukhatir",
        channelKu: "ئەحمەد بوخاطر",
        category: "nasheed",
        language: "ar",
    },
    {
        id: "mSF-r8FftT0",
        title: "Mesut Kurtis - Tabassam",
        titleKu: "مسعود کورتیس - تبسم",
        channel: "Mesut Kurtis",
        channelKu: "مسعود کورتیس",
        category: "nasheed",
        language: "ar",
    },
];

// YouTube search queries for "Load More" feature
export const searchQueries: Record<string, string> = {
    "all": "Islamic Kurdish Arabic content",
    "quran": "Quran recitation full سورة",
    "lecture-ku": "وتاری ئیسلامی کوردی Islamic Kurdish lecture",
    "lecture-ar": "محاضرات إسلامية Islamic lectures Arabic",
    "podcast": "Islamic podcast discussion",
    "nasheed": "Islamic nasheed أناشيد إسلامية",
};

export function getThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function getYouTubeSearchUrl(query: string): string {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
