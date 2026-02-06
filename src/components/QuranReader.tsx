import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuran, Surah, AyahWithTranslation } from "@/hooks/useQuran";
import { cn } from "@/lib/utils";

interface QuranReaderProps {
  initialSurah?: number;
}

export function QuranReader({ initialSurah = 1 }: QuranReaderProps) {
  const { surahs, fetchSurahAyahs } = useQuran();
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<AyahWithTranslation[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSurahList, setShowSurahList] = useState(false);

  useEffect(() => {
    if (surahs.length > 0 && !selectedSurah) {
      const surah = surahs.find((s) => s.number === initialSurah) || surahs[0];
      handleSelectSurah(surah);
    }
  }, [surahs, initialSurah]);

  const handleSelectSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setShowSurahList(false);
    setLoading(true);
    setCurrentAyahIndex(0);

    const fetchedAyahs = await fetchSurahAyahs(surah.number);
    setAyahs(fetchedAyahs);
    setLoading(false);
  };

  const currentAyah = ayahs[currentAyahIndex];

  const goToNextAyah = () => {
    if (currentAyahIndex < ayahs.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
    }
  };

  const goToPrevAyah = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative min-h-[600px]">
      {/* Surah selector toggle */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="glass"
          onClick={() => setShowSurahList(!showSurahList)}
          className="gap-2"
        >
          <BookOpen className="w-4 h-4" />
          {selectedSurah ? selectedSurah.englishName : "Select Surah"}
        </Button>
        
        {selectedSurah && (
          <div className="text-sm text-muted-foreground">
            Ayah {currentAyahIndex + 1} of {ayahs.length}
          </div>
        )}
      </div>

      {/* Surah list dropdown */}
      <AnimatePresence>
        {showSurahList && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 z-20 glass-card rounded-2xl max-h-[400px] overflow-y-auto scrollbar-thin"
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {surahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => handleSelectSurah(surah)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left",
                    selectedSurah?.number === surah.number
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                    selectedSurah?.number === surah.number
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10 text-primary"
                  )}>
                    {surah.number}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{surah.englishName}</div>
                    <div className={cn(
                      "text-xs",
                      selectedSurah?.number === surah.number
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}>
                      {surah.numberOfAyahs} verses
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ayah display */}
      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : currentAyah ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedSurah?.number}-${currentAyahIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="ayat-container"
          >
            {/* Surah name header */}
            {currentAyahIndex === 0 && selectedSurah && (
              <div className="text-center mb-8">
                <h2 className="font-arabic text-3xl text-primary mb-2">
                  {selectedSurah.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {selectedSurah.englishNameTranslation} • {selectedSurah.revelationType}
                </p>
              </div>
            )}

            {/* Bismillah for non-Fatiha and non-Tawba surahs */}
            {currentAyahIndex === 0 && selectedSurah && 
             selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
              <div className="text-center mb-8">
                <p className="font-arabic text-2xl text-accent">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}

            {/* Ayah number badge */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-light flex items-center justify-center text-primary-foreground font-display font-semibold">
                {currentAyah.numberInSurah}
              </div>
            </div>

            {/* Arabic text */}
            <div className="text-center mb-8">
              <p className="font-arabic text-3xl md:text-4xl leading-loose text-foreground">
                {currentAyah.text}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
            </div>

            {/* Translation */}
            <div className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {currentAyah.translation}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          Select a surah to begin reading
        </div>
      )}

      {/* Navigation */}
      {ayahs.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="glass"
            size="lg"
            onClick={goToPrevAyah}
            disabled={currentAyahIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>

          {/* Progress indicator */}
          <div className="flex items-center gap-1">
            {[...Array(Math.min(ayahs.length, 10))].map((_, i) => {
              const index = Math.floor((currentAyahIndex / ayahs.length) * Math.min(ayahs.length, 10));
              return (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === index ? "bg-primary w-4" : "bg-muted"
                  )}
                />
              );
            })}
          </div>

          <Button
            variant="gold"
            size="lg"
            onClick={goToNextAyah}
            disabled={currentAyahIndex === ayahs.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
