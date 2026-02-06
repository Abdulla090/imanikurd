import { useState, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Sunrise, Moon, CloudSun, Sunset, Clock, MapPin, RefreshCw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Building2, Search, Calendar } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const prayerIcons: Record<string, typeof Sun> = {
  Fajr: Moon,
  Sunrise: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
};

const prayerNames: Record<string, string> = {
  Fajr: "بەیانی",
  Sunrise: "خۆرهەڵات",
  Dhuhr: "نیوەڕۆ",
  Asr: "ئێوارە",
  Maghrib: "ڕۆژئاوا",
  Isha: "خەوتن",
};

// Map DB keys to Kurdish Names
const CITY_NAME_MAP: Record<string, string> = {
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

const CitySelectorModal = memo(({
  isOpen,
  onClose,
  cities,
  onSelect
}: {
  isOpen: boolean;
  onClose: () => void;
  cities: string[];
  onSelect: (city: string) => void;
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = cities.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()) ||
    (CITY_NAME_MAP[c] && CITY_NAME_MAP[c].includes(search))
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-background rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-border h-[500px] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="text-primary w-5 h-5" />
              شارەکەت گۆڕبکە
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="گەڕان بەدوای شاردا..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* City List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {filtered.map((city) => (
              <button
                key={city}
                onClick={() => onSelect(city)}
                className="w-full text-right p-3 rounded-xl hover:bg-muted transition-all flex items-center justify-between group"
              >
                <span className="font-bold text-foreground/90 group-hover:text-primary transition-colors">
                  {CITY_NAME_MAP[city] || city}
                </span>
                <span className="text-xs text-muted-foreground font-mono opacity-50">
                  {city}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                هیچ شارێک نەدۆزرایەوە
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
CitySelectorModal.displayName = 'CitySelectorModal';

const PrayerCard = memo(({
  prayer,
  isNext
}: {
  prayer: { key: string; time: string };
  isNext: boolean;
}) => {
  const Icon = prayerIcons[prayer.key];

  return (
    <div
      className={cn(
        "prayer-card transition-all duration-200",
        isNext && "active"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center prayer-icon",
          isNext ? "bg-accent/20" : "bg-primary/10"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            isNext ? "text-accent" : "text-primary"
          )} />
        </div>
        <span className={cn(
          "font-medium font-naskh",
          isNext ? "text-primary-foreground" : "text-foreground"
        )}>
          {prayerNames[prayer.key]}
        </span>
      </div>
      <p className={cn(
        "font-display text-2xl font-semibold",
        isNext ? "text-primary-foreground" : "text-foreground"
      )}>
        {prayer.time.split(" ")[0]}
      </p>
    </div>
  );
});
PrayerCard.displayName = 'PrayerCard';

export function PrayerTimesCard() {
  const {
    prayerTimes,
    loading,
    error,
    location,
    getNextPrayer,
    getTimeUntilNextPrayer,
    getMonthlyPrayerTimes,
    getCityName,
    refetch,
    setSelectedCity,
    availableCities
  } = usePrayerTimes();

  const nextPrayer = getNextPrayer();
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextPrayer());
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showMonthlyView, setShowMonthlyView] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());

  // Get monthly prayer times
  const monthlyData = useMemo(() => {
    return getMonthlyPrayerTimes(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, getMonthlyPrayerTimes]);

  // Update countdown immediately and every minute
  useEffect(() => {
    // Update immediately when prayer times load
    if (prayerTimes) {
      setTimeLeft(getTimeUntilNextPrayer());
    }

    // Then update every minute
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextPrayer());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [getTimeUntilNextPrayer, prayerTimes]);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    // Also save name to local storage for persistence across reloads (handled by hook mostly but good to be safe)
    localStorage.setItem('user-city-name', CITY_NAME_MAP[city] || city);
    setShowCitySelector(false);
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">چاوەڕوان بە... کاتی نوێژەکان بار دەکرێت</p>
        </div>
      </div>
    );
  }

  if (error || !prayerTimes) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <p className="text-destructive font-bold">{error || "هەڵەیەک ڕوویدا"}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 ml-2" />
            دووبارە هەوڵبدە
          </Button>
        </div>
      </div>
    );
  }

  // Determine display name
  // Format: "City Name" (e.g. "هەولێر")
  // Since usePrayerTimes returns the raw key if we use getCityName with lat/lng,
  // we try to map it.
  const currentCityKey = location ? getCityName(location.lat, location.lng) : "Hawler";
  // But wait, getCityName in hook ALREADY returns the Kurdish name if mapped!
  // Let's check the hook again. Yes, line 290 returns `map[key] || key`.
  // So `currentCityKey` is actually the Display Name if mapped.
  const cityName = currentCityKey;

  const prayers = [
    { key: "Fajr", time: prayerTimes.timings.Fajr },
    { key: "Sunrise", time: prayerTimes.timings.Sunrise },
    { key: "Dhuhr", time: prayerTimes.timings.Dhuhr },
    { key: "Asr", time: prayerTimes.timings.Asr },
    { key: "Maghrib", time: prayerTimes.timings.Maghrib },
    { key: "Isha", time: prayerTimes.timings.Isha },
  ];

  return (
    <>
      <CitySelectorModal
        isOpen={showCitySelector}
        onClose={() => setShowCitySelector(false)}
        cities={availableCities || []}
        onSelect={handleSelectCity}
      />

      <div className="space-y-6">
        {/* Date and Location Header */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MapPin className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-right">
              <h3 className="font-naskh text-2xl font-bold text-foreground mb-1">
                {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.ar} {prayerTimes.date.hijri.year}
              </h3>
              <p className="text-muted-foreground font-medium">
                {prayerTimes.date.gregorian.day} {prayerTimes.date.gregorian.month.en} {prayerTimes.date.gregorian.year}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCitySelector(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all border border-primary/20 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-base font-bold text-primary">{cityName}</span>
                <ChevronDown className="w-4 h-4 text-primary/70" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="bg-gradient-to-r from-primary via-emerald-600 to-primary rounded-2xl p-6 md:p-8 text-primary-foreground relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/80 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">نوێژی داهاتوو</span>
                </div>
                <h2 className="font-naskh text-4xl font-bold mb-2 drop-shadow-md">
                  {prayerNames[nextPrayer.name] || nextPrayer.name}
                </h2>
                {timeLeft && (
                  <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                    <p className="text-sm font-bold font-mono dir-ltr">
                      {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}
                    </p>
                    <span className="text-xs opacity-80">ماوە</span>
                  </div>
                )}
              </div>

              <div className="text-center md:text-left bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="font-display text-5xl font-bold tracking-tight shadow-sm">
                  {nextPrayer.time.split(" ")[0]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {prayers.map((prayer) => (
            <PrayerCard
              key={prayer.key}
              prayer={prayer}
              isNext={nextPrayer?.name === prayer.key}
            />
          ))}
        </div>

        {/* Monthly View Toggle */}
        <button
          onClick={() => setShowMonthlyView(!showMonthlyView)}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10"
        >
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">
            {showMonthlyView ? "داخستنی ڕووژمێری مانگانە" : "بینینی تەواوی مانگ"}
          </span>
          {showMonthlyView ? (
            <ChevronUp className="w-4 h-4 text-primary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary" />
          )}
        </button>

        {/* Monthly Calendar View */}
        <AnimatePresence>
          {showMonthlyView && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 glass-card rounded-2xl p-4 sm:p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMonth(prev => prev > 1 ? prev - 1 : 12)}
                    className="h-10 w-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>

                  <h3 className="text-lg font-bold text-foreground">
                    {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('ar-IQ', { month: 'long' })} {selectedYear}
                  </h3>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMonth(prev => prev < 12 ? prev + 1 : 1)}
                    className="h-10 w-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </div>

                {/* Prayer Times Table */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-2 text-right font-bold text-muted-foreground">ڕۆژ</th>
                        <th className="py-3 px-2 text-center font-bold text-muted-foreground">
                          <div className="flex flex-col items-center gap-1">
                            <Moon className="w-4 h-4" />
                            <span className="text-xs">بەیانی</span>
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center font-bold text-muted-foreground">
                          <div className="flex flex-col items-center gap-1">
                            <Sunrise className="w-4 h-4" />
                            <span className="text-xs">خۆرهەڵات</span>
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center font-bold text-muted-foreground">
                          <div className="flex flex-col items-center gap-1">
                            <Sun className="w-4 h-4" />
                            <span className="text-xs">نیوەڕۆ</span>
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center font-bold text-muted-foreground">
                          <div className="flex flex-col items-center gap-1">
                            <CloudSun className="w-4 h-4" />
                            <span className="text-xs">ئێوارە</span>
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center font-bold text-muted-foreground">
                          <div className="flex flex-col items-center gap-1">
                            <Sunset className="w-4 h-4" />
                            <span className="text-xs">ڕۆژئاوا</span>
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center font-bold text-muted-foreground">
                          <div className="flex flex-col items-center gap-1">
                            <Moon className="w-4 h-4" />
                            <span className="text-xs">خەوتن</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((dayData, index) => {
                        const isToday = dayData.day === new Date().getDate() &&
                          dayData.month === new Date().getMonth() + 1;
                        return (
                          <tr
                            key={index}
                            className={cn(
                              "border-b border-border/50 transition-colors",
                              isToday ? "bg-primary/10 font-bold" : "hover:bg-muted/50"
                            )}
                          >
                            <td className="py-2.5 px-2 text-right">
                              <span className={cn(
                                "inline-flex items-center justify-center w-8 h-8 rounded-full",
                                isToday ? "bg-primary text-primary-foreground" : ""
                              )}>
                                {dayData.day}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs sm:text-sm">{dayData.timings.Fajr}</td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs sm:text-sm">{dayData.timings.Sunrise}</td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs sm:text-sm">{dayData.timings.Dhuhr}</td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs sm:text-sm">{dayData.timings.Asr}</td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs sm:text-sm">{dayData.timings.Maghrib}</td>
                            <td className="py-2.5 px-2 text-center font-mono text-xs sm:text-sm">{dayData.timings.Isha}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {monthlyData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    داتای ئەم مانگە بەردەست نییە
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
