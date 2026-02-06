import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Book, ScrollText, FileText, ListChecks, GraduationCap, Sparkles, Star, RefreshCw, Clock, MessageCircle, Moon, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { useState, useEffect } from "react";



const dailyVerses = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    kurdish: "بەڕاستی لەگەڵ سەختی ئاسانی هەیە",
    surah: "الشرح",
    ayah: 6,
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    kurdish: "هەر کەسێک پشت بە خودا ببەستێت، ئەوا خودا بەسی دەبێت",
    surah: "الطلاق",
    ayah: 3,
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    kurdish: "یادم بکەن، منیش یادتان دەکەم",
    surah: "البقرة",
    ayah: 152,
  },
  {
    arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    kurdish: "ناامێد مەبن لە ڕەحمەتی خوا",
    surah: "يوسف",
    ayah: 87,
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    kurdish: "پەروەردگارا لە دونیا و ئاخیرەت چاکەمان پێ ببەخشە",
    surah: "البقرة",
    ayah: 201,
  },
  {
    arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ",
    kurdish: "بانگم بکەن، وەڵامتان دەدەمەوە",
    surah: "غافر",
    ayah: 60,
  },
  {
    arabic: "وَاللَّهُ مَعَ الصَّابِرِينَ",
    kurdish: "و خوا لەگەڵ ئەوانەیە کە سەبر دەکەن",
    surah: "البقرة",
    ayah: 153,
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    kurdish: "بەڕاستی خوا پاداشتی چاکەکاران بەفیڕۆ نادات",
    surah: "التوبة",
    ayah: 120,
  },
  {
    arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
    kurdish: "سەرکەوتنم تەنها لە خواوەیە",
    surah: "هود",
    ayah: 88,
  },
  {
    arabic: "فَإِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    kurdish: "بەڕاستی خوا لێخۆش بووە و بەزەییە",
    surah: "المائدة",
    ayah: 39,
  },
];

export default function Index() {
  const [currentVerse, setCurrentVerse] = useState(dailyVerses[0]);

  useEffect(() => {
    const dayIndex = new Date().getDate() % dailyVerses.length;
    setCurrentVerse(dailyVerses[dayIndex]);
  }, []);

  const getRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * dailyVerses.length);
    setCurrentVerse(dailyVerses[randomIndex]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GeometricPattern />
      <Navigation />

      {/* Bookmark icon - subtle */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-32 right-6 z-20 pointer-events-none"
      >
        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center opacity-50">
          <Star className="w-5 h-5 text-accent" />
        </div>
      </motion.div>

      <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-2 sm:px-4 md:px-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Welcome badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground mb-8"
            >
              <span className="text-sm">بەخێربێیت بۆ ئیمان</span>
            </motion.div>

            {/* Bismillah */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="font-arabic text-5xl md:text-7xl text-foreground leading-relaxed">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ
              </h1>
            </motion.div>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
              پلاتفۆرمێکی تەواو بۆ خوێندنەوەی قورئانی پیرۆز، حەدیس، و شوێنکەوتنی کارە چاکەکان و گوناهەکان بۆ کۆمەڵگەی کوردی ئیسلامی
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Link to="/start">
                  <Sparkles className="w-5 h-5" />
                  دەستپێبکە
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Link to="/tracker">
                  <Star className="w-5 h-5" />
                  شوێنکەوتنی کردار
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl mx-auto mb-12 sm:mb-20"
          >
            <div className="stat-card">
              <div className="stat-number text-2xl sm:text-4xl">١١٤</div>
              <div className="stat-label">سورەت</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-2xl sm:text-4xl text-accent">٦٢٣٦</div>
              <div className="stat-label">ئایەت</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-2xl sm:text-4xl">٤٠+</div>
              <div className="stat-label">حەدیس</div>
            </div>
          </motion.div>

          {/* Mobile-Only: Creative Bento Experience */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-16 md:hidden px-2"
          >
            {/* Section Title */}
            <div className="text-center mb-6">
              <p className="text-xs text-primary/60 uppercase tracking-widest mb-1">ابدأ رحلتك</p>
              <h2 className="font-naskh text-xl font-bold text-foreground">گەشتی ڕۆحی</h2>
            </div>

            {/* Creative Bento Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Large Card - Quran (spans 2 cols) */}
              <Link
                to="/quran"
                className="col-span-2 relative overflow-hidden rounded-3xl h-40 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-primary/70" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Book className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] text-white/60 bg-white/10 px-2 py-1 rounded-full">114 سورە</span>
                  </div>

                  <div>
                    <p className="font-arabic text-lg text-white/90 leading-relaxed mb-1">
                      اقْرَأْ بِاسْمِ رَبِّكَ
                    </p>
                    <p className="text-xs text-white/60">خوێندنەوەی قورئانی پیرۆز</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity" />
              </Link>

              {/* Azkar Card */}
              <Link
                to="/azkar"
                className="relative overflow-hidden rounded-3xl h-44 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-800/80" />
                <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl" />

                <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Moon className="w-4 h-4 text-white" />
                  </div>

                  <div>
                    <p className="font-arabic text-sm text-white/80 mb-1">أَعُوذُ بِاللَّهِ</p>
                    <p className="text-[11px] text-white/50 font-medium">ئەزکاری بەیانی</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity" />
              </Link>

              {/* Prayer Times Card */}
              <Link
                to="/prayer-times"
                className="relative overflow-hidden rounded-3xl h-44 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-900/90 to-blue-800/80" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-sky-400/20 rounded-full blur-xl translate-y-1/2" />

                <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-white/90 tabular-nums">٥:٤٥</p>
                    <p className="text-[11px] text-white/50 font-medium">کاتی نوێژ</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity" />
              </Link>

              {/* Tasbih Card */}
              <Link
                to="/tasbih"
                className="relative overflow-hidden rounded-3xl h-36 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 to-orange-800/80" />
                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-amber-400/20 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 h-full p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2 border border-white/20">
                    <span className="text-lg font-bold text-white">٣٣</span>
                  </div>
                  <p className="text-[11px] text-white/60 font-medium">تەسبیح</p>
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity" />
              </Link>

              {/* Hadith Card */}
              <Link
                to="/hadith"
                className="relative overflow-hidden rounded-3xl h-36 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900/90 to-pink-800/80" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-rose-400/20 rounded-full blur-xl translate-y-1/2" />

                <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <ScrollText className="w-4 h-4 text-white" />
                  </div>

                  <div>
                    <p className="text-xs text-white/80 font-medium">فەرموودە</p>
                    <p className="text-[10px] text-white/50">٤٠+ حەدیس</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity" />
              </Link>

              {/* Names of Allah Card */}
              <Link
                to="/names"
                className="relative overflow-hidden rounded-3xl h-36 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 to-emerald-800/80" />
                <div className="absolute top-0 right-0 w-20 h-20 bg-teal-400/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>

                  <div>
                    <p className="text-xs text-white/80 font-medium">ناوەکانی خودا</p>
                    <p className="text-[10px] text-white/50">٩٩ ناو</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Bottom Inspirational Touch */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-muted-foreground/60 italic">
                "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ"
              </p>
            </motion.div>
          </motion.div>

          {/* Desktop-Only: Bento Grid Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-20 hidden md:block"
          >
            <div className="text-center mb-10">
              <h2 className="font-naskh text-2xl font-bold text-foreground mb-2">تایبەتمەندیەکان</h2>
              <p className="text-muted-foreground">هەموو شتێک لە یەک شوێن</p>
              <p className="text-sm text-muted-foreground mt-1">
                ئامرازە تەواوەکان بۆ گەشەی ڕۆحی و شوێنکەوتنی کارە ئایینیەکان
              </p>
            </div>

            {/* Bento Grid Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-24"
            >
              <div className="text-center mb-12">
                <h2 className="font-naskh text-3xl font-bold text-foreground mb-4">گەشتە ڕۆحیەکەت دەوڵەمەند بکە</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  هەموو ئەو ئامرازانەی پێویستتە بۆ نزیکبوونەوە لە پەروەردگار، بە دیزاینێکی مۆدێرن و دڵگیر
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                {/* Large Card - Quran */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="md:col-span-4 md:row-span-2 relative overflow-hidden rounded-3xl p-8 glass-card border-none bg-gradient-to-br from-primary/5 to-primary/10 group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-500 group-hover:scale-110" />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
                        <Book className="w-6 h-6" />
                      </div>
                      <h3 className="font-naskh text-3xl font-bold mb-2">قورئانی پیرۆز</h3>
                      <p className="text-muted-foreground text-lg mb-6 max-w-md">
                        خوێندنەوە و گوێگرتن لە قورئان بە تەفسیری کوردی. لەگەڵ خوێندنەوەی شەوانە و دۆخی تاریک.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-background/50 text-xs border border-primary/20">تەفسیری کوردی</span>
                        <span className="px-3 py-1 rounded-full bg-background/50 text-xs border border-primary/20">دەنگی قورئانخوێنەکان</span>
                        <span className="px-3 py-1 rounded-full bg-background/50 text-xs border border-primary/20">گەران بەناو ئایەتەکان</span>
                      </div>
                    </div>

                    <div className="bg-background/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 mt-8">
                      <p className="font-arabic text-2xl text-right mb-2 leading-loose">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</p>
                      <p className="text-sm text-muted-foreground text-right border-t border-primary/10 pt-2 mt-2">خوێنە بەناوی پەروەردگارت...</p>
                    </div>
                  </div>
                  <Link to="/quran" className="absolute inset-0 z-20" aria-label="چوون بۆ قورئان" />
                </motion.div>

                {/* Medium Card - Prayer */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl p-6 glass-card border-none bg-gradient-to-br from-blue-500/5 to-blue-600/10 group"
                >
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded">London</span>
                    </div>

                    <h3 className="font-naskh text-xl font-bold mb-1">کاتی نوێژەکان</h3>
                    <p className="text-sm text-muted-foreground mb-4">ئاگادارکردنەوەی ورد بۆ هەموو نوێژەکان</p>

                    <div className="flex items-center gap-2 mt-auto">
                      <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%]" />
                      </div>
                      <span className="text-xs text-blue-600 font-bold">Asr</span>
                    </div>
                  </div>
                  <Link to="/prayer-times" className="absolute inset-0 z-20" aria-label="چوون بۆ کاتی نوێژ" />
                </motion.div>

                {/* Small Card - AI Chat */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl p-6 glass-card border-none bg-gradient-to-br from-purple-500/5 to-purple-600/10 group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-naskh text-lg font-bold">یاریدەدەری ئیمان</h3>
                        <p className="text-xs text-purple-600">AI Islamic Assistant</p>
                      </div>
                    </div>
                    <div className="mt-auto bg-background/50 rounded-lg p-3 text-xs text-muted-foreground border border-purple-100 dark:border-purple-900/30">
                      "چۆن دەتوانم نوێژی ئیستخارە بکەم؟"
                    </div>
                  </div>
                  <div className="absolute inset-0 z-20 cursor-pointer" onClick={() => document.querySelector<HTMLElement>('.chat-trigger')?.click()} />
                </motion.div>

              </div>

              {/* Second Row of Grid - 4 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl glass-card border-none bg-card/50 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center mb-3">
                    <ListChecks className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-1">چاودێری کردەوەکان</h4>
                  <p className="text-xs text-muted-foreground">ڕۆژانە کردەوەکانت تۆمار بکە</p>
                  <Link to="/tracker" className="absolute inset-0" aria-label="Tracker" />
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl glass-card border-none bg-card/50 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mb-3">
                    <Circle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-1">تەسبیحی دیجیتاڵ</h4>
                  <p className="text-xs text-muted-foreground">ژمێرەری زیرەک بۆ زیکرەکان</p>
                  <Link to="/tasbih" className="absolute inset-0" aria-label="Tasbih" />
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl glass-card border-none bg-card/50 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center mb-3">
                    <Moon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-1">ئەزکارەکان</h4>
                  <p className="text-xs text-muted-foreground">بەیانیان و ئێواران</p>
                  <Link to="/azkar" className="absolute inset-0" aria-label="Azkar" />
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl glass-card border-none bg-card/50 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-1">ناوەکانی خودا</h4>
                  <p className="text-xs text-muted-foreground">٩٩ ناوی پیرۆز</p>
                  <Link to="/names" className="absolute inset-0" aria-label="Names of Allah" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Daily Verse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center mb-6">
              <h2 className="font-naskh text-xl font-bold text-foreground">ئایەتی ڕۆژ</h2>
            </div>
            <div className="verse-card max-w-2xl mx-auto p-4 sm:p-8">
              <p className="font-arabic text-3xl md:text-4xl text-foreground mb-6 leading-loose">
                {currentVerse.arabic}
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                {currentVerse.kurdish}
              </p>
              <p className="text-sm text-primary">
                سورەت {currentVerse.surah}•ئایەت {currentVerse.ayah}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={getRandomVerse}
                className="mt-4 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                ئایەتێکی تر
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
