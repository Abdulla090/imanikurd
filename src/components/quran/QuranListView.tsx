import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
    const INITIAL_VISIBLE = 10;
    const LOAD_MORE_STEP = 10;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

    // Reset visible count when ayahs change (new surah selected)
    useEffect(() => {
        setVisibleCount(INITIAL_VISIBLE);
    }, [ayahs]);

    const visibleAyahs = ayahs.slice(0, visibleCount);
    const remainingAyahs = Math.max(ayahs.length - visibleCount, 0);

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
            {remainingAyahs > 0 && (
                <div className="flex flex-col items-center gap-3 py-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setVisibleCount((prev) =>
                                Math.min(prev + LOAD_MORE_STEP, ayahs.length)
                            )
                        }
                    >
                        زیاتر پیشان بدە ({Math.min(LOAD_MORE_STEP, remainingAyahs)} ئایەت)
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        {remainingAyahs} ئایەت ماوە
                    </p>
                </div>
            )}
        </div>
    );
});
