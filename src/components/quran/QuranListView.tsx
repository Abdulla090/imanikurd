import { memo, useRef, useState, useEffect, useCallback } from "react";
import { AyahWithTranslation, Surah, TafsirData } from "./types";

interface QuranListViewProps {
    ayahs: AyahWithTranslation[];
    selectedSurah: Surah;
    tafsirData: TafsirData;
    showTafsir: boolean;
}

// Individual ayah row — memoized to avoid re-renders
const AyahRow = memo(function AyahRow({
    ayah,
    surahNumber,
    tafsirData,
    showTafsir,
}: {
    ayah: AyahWithTranslation;
    surahNumber: number;
    tafsirData: TafsirData;
    showTafsir: boolean;
}) {
    return (
        <div className="feature-card p-4 relative group">
            <div className="absolute top-4 left-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {ayah.numberInSurah}
            </div>
            <p className="font-arabic text-2xl leading-loose text-right mt-6 mb-4">{ayah.text}</p>
            {showTafsir && (
                <p className="text-muted-foreground leading-relaxed border-r-2 border-primary/20 pr-3 mr-1">
                    {tafsirData[surahNumber]?.[ayah.numberInSurah] || ""}
                </p>
            )}
        </div>
    );
});

// Simple windowed rendering — only render visible ayahs + buffer
export const QuranListView = memo(function QuranListView({
    ayahs,
    selectedSurah,
    tafsirData,
    showTafsir,
}: QuranListViewProps) {
    const BATCH_SIZE = 20; // Initial ayahs to render
    const LOAD_MORE = 15; // How many more to load each time
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Reset visible count when ayahs change (new surah selected)
    useEffect(() => {
        setVisibleCount(BATCH_SIZE);
    }, [ayahs]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < ayahs.length) {
                    setVisibleCount((prev) => Math.min(prev + LOAD_MORE, ayahs.length));
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [visibleCount, ayahs.length]);

    const visibleAyahs = ayahs.slice(0, visibleCount);

    return (
        <div className="space-y-6 pb-48">
            {visibleAyahs.map((ayah) => (
                <AyahRow
                    key={ayah.number}
                    ayah={ayah}
                    surahNumber={selectedSurah.number}
                    tafsirData={tafsirData}
                    showTafsir={showTafsir}
                />
            ))}
            {/* Sentinel for loading more */}
            {visibleCount < ayahs.length && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
});
