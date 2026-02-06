import { motion, AnimatePresence } from "framer-motion";
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AyahWithTranslation, Surah, TafsirData } from "./types";
import { TAFSIR_OPTIONS } from "./constants";

interface QuranCardViewProps {
    currentAyah: AyahWithTranslation;
    currentAyahIndex: number;
    totalAyahs: number;
    selectedSurah: Surah;
    tafsirData: TafsirData;
    selectedTafsir: string;
    showTafsir: boolean;
    onCopyAyah: () => void;
    onShareAyah: () => void;
}

export function QuranCardView({
    currentAyah,
    currentAyahIndex,
    totalAyahs,
    selectedSurah,
    tafsirData,
    selectedTafsir,
    showTafsir,
    onCopyAyah,
    onShareAyah
}: QuranCardViewProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentAyahIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="ayat-container"
            >
                {/* Surah Header info */}
                <div className="text-center mb-6">
                    <h2 className="font-arabic text-2xl text-primary">{selectedSurah?.name}</h2>
                    <div className="text-xs text-muted-foreground mt-1">ئایەت {currentAyah.numberInSurah} لە {totalAyahs}</div>
                </div>

                {/* Bismillah */}
                {currentAyahIndex === 0 && selectedSurah?.number !== 1 && selectedSurah?.number !== 9 && (
                    <div className="text-center mb-8 font-arabic text-xl text-primary/80">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                )}

                <div className="text-center mb-8">
                    <p className="font-arabic text-3xl md:text-4xl leading-[2.5] text-foreground">
                        {currentAyah.text}
                    </p>
                </div>

                {showTafsir && (
                    <div className="bg-muted/30 p-4 rounded-2xl text-center border border-border/50">
                        <div className="text-xs text-primary mb-2 font-bold">{TAFSIR_OPTIONS.find(t => t.id === selectedTafsir)?.name}</div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {tafsirData[selectedSurah.number]?.[currentAyah.numberInSurah] || "تەفسیر بەردەست نییە بۆ ئەم ئایەتە"}
                        </p>
                    </div>
                )}

                <div className="flex justify-center gap-3 mt-6">
                    <Button variant="outline" size="sm" onClick={onCopyAyah}>
                        <Copy className="w-4 h-4 mr-2" /> کۆپی
                    </Button>
                    <Button variant="outline" size="sm" onClick={onShareAyah}>
                        <Share2 className="w-4 h-4 mr-2" /> هاوبەشی
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
