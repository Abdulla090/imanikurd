import { useState, useEffect, useCallback } from "react";
import { dailyTasks } from "@/data/ramadanSchedule";

const STORAGE_KEY = "ramadan-progress-2026";

// Structure: { "day-1": { "quran": true, "fajr": false, ... }, "day-2": { ... } }
export type DayProgress = Record<string, boolean>;
export type RamadanProgress = Record<string, DayProgress>;

export function useRamadanProgress() {
    const [progress, setProgress] = useState<RamadanProgress>({});

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProgress(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load Ramadan progress:", e);
        }
    }, []);

    // Persist to localStorage whenever progress changes
    const persist = useCallback((newProgress: RamadanProgress) => {
        setProgress(newProgress);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
        } catch (e) {
            console.error("Failed to save Ramadan progress:", e);
        }
    }, []);

    const toggleTask = useCallback(
        (day: number, taskId: string) => {
            const dayKey = `day-${day}`;
            const current = progress[dayKey] || {};
            const updated: RamadanProgress = {
                ...progress,
                [dayKey]: {
                    ...current,
                    [taskId]: !current[taskId],
                },
            };
            persist(updated);
        },
        [progress, persist]
    );

    const isTaskDone = useCallback(
        (day: number, taskId: string): boolean => {
            const dayKey = `day-${day}`;
            return !!progress[dayKey]?.[taskId];
        },
        [progress]
    );

    const getDayProgress = useCallback(
        (day: number): { completed: number; total: number; percentage: number } => {
            const dayKey = `day-${day}`;
            const dayData = progress[dayKey] || {};
            const total = dailyTasks.length;
            const completed = Object.values(dayData).filter(Boolean).length;
            return {
                completed,
                total,
                percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            };
        },
        [progress]
    );

    const getOverallProgress = useCallback((): {
        completedDays: number;
        totalDays: number;
        percentage: number;
        completedTasks: number;
        totalTasks: number;
    } => {
        const totalDays = 30;
        const totalTasksPerDay = dailyTasks.length;
        let completedDays = 0;
        let completedTasks = 0;

        for (let d = 1; d <= 30; d++) {
            const dayKey = `day-${d}`;
            const dayData = progress[dayKey] || {};
            const done = Object.values(dayData).filter(Boolean).length;
            completedTasks += done;
            if (done === totalTasksPerDay) completedDays++;
        }

        const totalTasks = totalDays * totalTasksPerDay;
        return {
            completedDays,
            totalDays,
            percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            completedTasks,
            totalTasks,
        };
    }, [progress]);

    const resetProgress = useCallback(() => {
        persist({});
    }, [persist]);

    return {
        progress,
        toggleTask,
        isTaskDone,
        getDayProgress,
        getOverallProgress,
        resetProgress,
    };
}
