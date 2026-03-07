import { memo } from "react";
import { AyahWithTranslation, Surah, TafsirData } from "./types";

interface QuranListViewProps {
    ayahs: AyahWithTranslation[];
    selectedSurah: Surah;
    tafsirData: TafsirData;
    showTafsir: boolean;
}

export const QuranListView = memo(function QuranListView({
    ayahs,
    selectedSurah,
    tafsirData,
    showTafsir
}: QuranListViewProps) {
    return (
        <div className="space-y-6 pb-48">
            {ayahs.map((ayah) => (
                <div key={ayah.number} className="feature-card p-4 relative group">
                    <div className="absolute top-4 left-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {ayah.numberInSurah}
                    </div>
                    <p className="font-arabic text-2xl leading-loose text-right mt-6 mb-4">{ayah.text}</p>
                    {showTafsir && (
                        <p className="text-muted-foreground leading-relaxed border-r-2 border-primary/20 pr-3 mr-1">
                            {tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || ""}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
});
