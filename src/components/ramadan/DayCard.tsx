import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    BookOpen, Sunrise, Sun, CloudSun, Sunset, Moon, Star,
    HeartHandshake, ChevronDown, CheckCircle2, Circle, Sparkles, Hand, Flame
} from "lucide-react";
import type { RamadanDay } from "@/data/ramadanSchedule";
import { dailyTasks } from "@/data/ramadanSchedule";
import { useRamadanProgress } from "@/hooks/useRamadanProgress";
import { cn } from "@/lib/utils"; // Assuming standard shadcn utils exist

const iconMap: Record<string, React.ElementType> = {
    "book-open": BookOpen,
    "sunrise": Sunrise,
    "sun": Sun,
    "cloud-sun": CloudSun,
    "sunset": Sunset,
    "moon": Moon,
    "star": Star,
    "hand-heart": Hand,
    "heart-handshake": HeartHandshake,
};

interface DayCardProps {
    day: RamadanDay;
    isToday?: boolean;
    index: number;
}

export function DayCard({ day, isToday, index }: DayCardProps) {
    const [isExpanded, setIsExpanded] = useState(isToday || false);
    const { toggleTask, isTaskDone, getDayProgress } = useRamadanProgress();
    const dayProgress = getDayProgress(day.day);
    const isComplete = dayProgress.percentage === 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="relative mb-3 last:mb-0"
            dir="rtl"
        >
            <div
                className={cn(
                    "bg-card rounded-xl border transition-all duration-300 overflow-hidden",
                    isToday ? "border-emerald-500 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5" : "border-border/60 shadow-sm hover:border-emerald-500/30",
                    isComplete && "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800"
                )}
            >
                {/* Card Header (Always Visible) */}
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-4 flex items-center gap-4 cursor-pointer select-none"
                >
                    {/* Day Number Box - Very clean */}
                    <div
                        className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold font-mono transition-colors",
                            isComplete
                                ? "bg-emerald-600 text-white shadow-sm"
                                : isToday
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                    : "bg-muted text-muted-foreground"
                        )}
                    >
                        {isComplete ? <CheckCircle2 className="w-6 h-6" /> : day.day}
                    </div>

                    {/* Text Info */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className={cn("text-base font-bold font-naskh", isToday ? "text-emerald-700 dark:text-emerald-400" : "text-foreground")}>
                                {day.juzNameKu}
                            </h3>
                            {isToday && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-full">ئەمڕۆ</span>}
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground mt-0.5 gap-2">
                            <span className="font-medium text-foreground/80">{day.startSurah}</span>
                            <span className="opacity-50">←</span>
                            <span className="font-medium text-foreground/80">{day.endSurah}</span>
                        </div>
                    </div>

                    {/* Simple circular progress or chevron */}
                    <div className="flex items-center gap-3">
                        {dayProgress.percentage > 0 && !isComplete && (
                            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                                {Math.round(dayProgress.percentage)}%
                            </div>
                        )}
                        <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                    </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 pt-0 border-t border-border/40">
                                {/* Grid Layout for Content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                                    {/* Right Column: Quran & Dua */}
                                    <div className="space-y-3">
                                        {/* Quran Details */}
                                        <div className="bg-muted/30 rounded-lg p-3 border border-border/40">
                                            <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
                                                <BookOpen className="w-4 h-4" />
                                                <span className="text-xs font-bold">وردەی ئەمڕۆ</span>
                                            </div>
                                            <div className="text-xs space-y-1 text-muted-foreground">
                                                <div className="flex justify-between"><span>لاپەڕەکان:</span> <span className="font-mono text-foreground">{day.pages}</span></div>
                                                <div className="flex justify-between"><span>پارە:</span> <span className="font-mono text-foreground">{day.juzNameAr}</span></div>
                                            </div>
                                        </div>

                                        {/* Dua */}
                                        <div className="opacity-90">
                                            <div className="flex items-center gap-2 mb-1.5 text-amber-600 dark:text-amber-500">
                                                <Sparkles className="w-4 h-4" />
                                                <span className="text-xs font-bold">دوعای ڕۆژ</span>
                                            </div>
                                            <p className="font-arabic text-sm text-center leading-loose text-foreground py-2 border-y border-border/30 border-dashed">
                                                {day.dua}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground text-center mt-1.5 italic">
                                                {day.duaTranslation}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Left Column: Checklist */}
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="text-xs font-bold text-foreground">ئەرکەکان</span>
                                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{dayProgress.completed}/{dayProgress.total}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {dailyTasks.map((task) => {
                                                const done = isTaskDone(day.day, task.id);
                                                const Icon = iconMap[task.icon] || Circle;
                                                return (
                                                    <button
                                                        key={task.id}
                                                        onClick={() => toggleTask(day.day, task.id)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-2 rounded-lg text-right transition-all text-xs border border-transparent",
                                                            done
                                                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/50"
                                                                : "hover:bg-muted text-foreground"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                            done ? "bg-emerald-600 border-emerald-600 text-white" : "border-muted-foreground/30 bg-background"
                                                        )}>
                                                            {done && <CheckCircle2 className="w-3 h-3" />}
                                                        </div>
                                                        <span className={cn("flex-1", done && "line-through opacity-70")}>{task.labelKu}</span>
                                                        <Icon className={cn("w-3.5 h-3.5 opacity-50", done && "text-emerald-600 opacity-100")} />
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
