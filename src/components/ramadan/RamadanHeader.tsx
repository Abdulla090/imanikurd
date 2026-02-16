import { motion } from "framer-motion";
import { Moon, Star, BookOpen, Clock, TrendingUp, Flame, ChevronDown } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useRamadanProgress } from "@/hooks/useRamadanProgress";
import { useEffect, useState } from "react";

export function RamadanHeader() {
    const { prayerTimes } = usePrayerTimes();
    const { getOverallProgress } = useRamadanProgress();
    const overall = getOverallProgress();
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, label: "" });

    useEffect(() => {
        if (!prayerTimes?.timings) return;

        const tick = () => {
            const now = new Date();
            const parsePrayerTime = (timeStr: string) => {
                const cleaned = timeStr.split(" ")[0].trim();
                const [h, m] = cleaned.split(":").map(Number);
                return h * 60 + m;
            };

            const currentMins = now.getHours() * 60 + now.getMinutes();
            const maghribMins = parsePrayerTime(prayerTimes.timings.Maghrib);
            const fajrMins = parsePrayerTime(prayerTimes.timings.Fajr);

            let targetMins: number;
            let label: string;

            if (currentMins < fajrMins) {
                targetMins = fajrMins;
                label = "کات ماوە بۆ پارشێو";
            } else if (currentMins < maghribMins) {
                targetMins = maghribMins;
                label = "کات ماوە بۆ بەربانگ";
            } else {
                targetMins = fajrMins + 24 * 60;
                label = "کات ماوە بۆ پارشێو";
            }

            const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            const targetSecs = targetMins * 60;
            let diff = targetSecs - nowSecs;
            if (diff < 0) diff += 24 * 3600;

            setCountdown({
                hours: Math.floor(diff / 3600),
                minutes: Math.floor((diff % 3600) / 60),
                seconds: diff % 60,
                label,
            });
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [prayerTimes]);

    const progressPercent = overall.percentage;

    return (
        <div className="space-y-6 mb-10" dir="rtl">
            {/* Hero Card - Premium Royal Islamic Design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-[2rem] shadow-2xl"
                style={{
                    background: "linear-gradient(180deg, #022c22 0%, #064e3b 100%)", // Deep Emerald
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
            >
                {/* Islamic Geometric Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dfae47' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* Golden Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent opacity-50"></div>

                <div className="relative z-10 p-8 flex flex-col items-center justify-center text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-900/40 backdrop-blur-sm mb-6">
                        <Moon className="w-4 h-4 text-[#fbbf24]" />
                        <span className="text-sm font-bold text-emerald-100 tracking-wide">مانگی پیرۆزی ڕەمەزان</span>
                    </div>

                    {/* Main Countdown - Digital & Sharp */}
                    <div className="w-full max-w-lg mx-auto mb-8">
                        <span className="text-emerald-200/80 text-sm font-medium mb-3 block">{countdown.label}</span>
                        <div className="grid grid-cols-3 gap-4" dir="ltr">
                            {[
                                { val: countdown.hours, label: "کاتژمێر" },
                                { val: countdown.minutes, label: "خولەک" },
                                { val: countdown.seconds, label: "چرکە" },
                            ].map((unit, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="relative bg-black/20 border border-emerald-500/20 rounded-xl w-full aspect-square flex items-center justify-center backdrop-blur-md shadow-inner">
                                        <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-wider tabular-nums">
                                            {String(unit.val).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <span className="text-xs text-emerald-300/60 mt-2">{unit.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {[
                        { label: "قورئان", val: overall.completedTasks, total: overall.totalTasks, icon: BookOpen },
                        { label: "ڕۆژوو", val: overall.completedDays, total: overall.totalDays, icon: Flame },
                    ].map((stat, i) => (
                        <div key={i} className="hidden" /> // Hidden for now, cleaner look
                    ))}

                    {/* Simple Clean Progress Bar */}
                    <div className="w-full max-w-md mx-auto">
                        <div className="flex justify-between text-xs text-emerald-200/60 mb-2 px-1">
                            <span>پێشکەوتنی مانگ</span>
                            <span className="font-mono">{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-500/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-[#fbbf24] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                            />
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Quick Stats - Minimalist */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border/40 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">ڕۆژانی تەواو بوو</p>
                            <p className="text-lg font-bold text-foreground font-mono">{overall.completedDays}<span className="text-muted-foreground/60 text-sm">/30</span></p>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border/40 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">ئەرکی تەواو بوو</p>
                            <p className="text-lg font-bold text-foreground font-mono">{overall.completedTasks}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
