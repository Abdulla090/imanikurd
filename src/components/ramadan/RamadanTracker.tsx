import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ramadanSchedule } from "@/data/ramadanSchedule";
import { DayCard } from "./DayCard";
import { useRamadanProgress } from "@/hooks/useRamadanProgress";
import { ListChecks, CalendarDays, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "incomplete" | "complete";
type ViewType = "list" | "phases";

export function RamadanTracker() {
    const { getDayProgress } = useRamadanProgress();
    const [filter, setFilter] = useState<FilterType>("all");
    const [view, setView] = useState<ViewType>("list");
    const todayRef = useRef<HTMLDivElement>(null);

    const getCurrentRamadanDay = (): number => {
        // Logic remains effectively the same, just keeping it robust
        const ramadanStart = new Date(2026, 1, 18);
        const today = new Date();
        const diffTime = today.getTime() - ramadanStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays >= 1 && diffDays <= 30) return diffDays;
        return -1;
    };

    const currentDay = getCurrentRamadanDay();

    useEffect(() => {
        if (todayRef.current) {
            setTimeout(() => {
                todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 500);
        }
    }, []);

    const filteredDays = ramadanSchedule.filter((day) => {
        if (filter === "all") return true;
        const progress = getDayProgress(day.day);
        if (filter === "complete") return progress.percentage === 100;
        if (filter === "incomplete") return progress.percentage < 100;
        return true;
    });

    const phases = [
        { name: "ڕەحمەت", range: "١ - ١٠", description: "دەهەی یەکەم", days: ramadanSchedule.slice(0, 10) },
        { name: "مەغفیرەت", range: "١١ - ٢٠", description: "دەهەی دووەم", days: ramadanSchedule.slice(10, 20) },
        { name: "ڕزگاربوون", range: "٢١ - ٣٠", description: "دەهەی سێیەم", days: ramadanSchedule.slice(20, 30) },
    ];

    return (
        <div dir="rtl" className="w-full">
            {/* Controls - Professional Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                {/* View Switcher */}
                <div className="flex p-1 bg-muted/50 rounded-lg border border-border/50">
                    <button
                        onClick={() => setView("list")}
                        className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                            view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <ListChecks className="w-3.5 h-3.5" />
                        لیستی ڕۆژانە
                    </button>
                    <button
                        onClick={() => setView("phases")}
                        className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                            view === "phases" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <CalendarDays className="w-3.5 h-3.5" />
                        قۆناغەکان
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {[
                        { id: "all", label: "هەموو" },
                        { id: "incomplete", label: "نەتەمام" },
                        { id: "complete", label: "تەمام" },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as FilterType)}
                            className={cn(
                                "px-3 py-1.5 text-xs rounded-md border transition-colors",
                                filter === f.id
                                    ? "bg-emerald-600 border-emerald-600 text-white font-medium"
                                    : "bg-transparent border-transparent text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {view === "list" ? (
                    <div className="space-y-3">
                        {filteredDays.map((day, i) => (
                            <div key={day.day} ref={day.day === currentDay ? todayRef : null}>
                                <DayCard day={day} isToday={day.day === currentDay} index={i} />
                            </div>
                        ))}
                        {filteredDays.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl border-muted">
                                <p>هیچ ڕۆژێک نییە</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {phases.map((phase, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <h3 className="font-bold text-lg">{phase.name} <span className="text-sm font-normal text-muted-foreground">({phase.range})</span></h3>
                                </div>
                                <div className="space-y-3 border-r-2 border-border/40 pr-4 mr-3.5">
                                    {phase.days
                                        .filter(d => {
                                            if (filter === "all") return true;
                                            const p = getDayProgress(d.day);
                                            return filter === "complete" ? p.percentage === 100 : p.percentage < 100;
                                        })
                                        .map((day, idx) => (
                                            <div key={day.day} ref={day.day === currentDay ? todayRef : null}>
                                                <DayCard day={day} isToday={day.day === currentDay} index={idx} />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
