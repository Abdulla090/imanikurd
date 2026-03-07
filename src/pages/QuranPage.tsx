import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { BookOpen, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTafsirCache } from "@/hooks/useTafsirCache";

// Import Quran components
import {
  Surah,
  AyahWithTranslation,
  Qari,
  QARI_OPTIONS,
  SURAHS_DATA,
  SurahList,
  QuranBookView,
  QuranCardView,
  QuranListView,
  AudioPlayer,
  QuranSettings
} from "@/components/quran";

export default function QuranPage() {
  const [surahs] = useState<Surah[]>(SURAHS_DATA);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<AyahWithTranslation[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSurahList, setShowSurahList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTafsir, setShowTafsir] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "list" | "book">("list");

  // Use cached tafsir hook — prioritizes parsing the current surah first
  const { tafsirData, tafsirLoaded, selectedTafsir, setSelectedTafsir, loadForSurah } = useTafsirCache(selectedSurah?.number);

  // Pagination Logic for Book View
  const paginatedPages = useMemo(() => {
    if (!ayahs.length) return [];

    const CHARS_PER_PAGE = 850;
    const pages: AyahWithTranslation[][] = [];
    let currentPage: AyahWithTranslation[] = [];
    let currentChars = 0;

    for (let i = 0; i < ayahs.length; i++) {
      const ayah = ayahs[i];
      if (currentChars + ayah.text.length > CHARS_PER_PAGE && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentChars = 0;
      }
      currentPage.push(ayah);
      currentChars += ayah.text.length;
    }

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  }, [ayahs]);

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [loadedSurahNum, setLoadedSurahNum] = useState<number | null>(null);
  const [selectedQari, setSelectedQari] = useState<Qari>(QARI_OPTIONS[0]);
  const [loadedQariId, setLoadedQariId] = useState<string | null>(null);

  // Get audio URL for surah
  const getAudioUrl = useCallback(
    (surahNum: number) => selectedQari.getUrl(surahNum),
    [selectedQari]
  );

  // Load audio
  const loadAudio = useCallback(
    async (surahNum: number, qariId: string): Promise<boolean> => {
      if (!audioRef.current) return false;

      if (loadedSurahNum === surahNum && loadedQariId === qariId && audioRef.current.readyState >= 2) {
        return true;
      }

      setAudioLoading(true);

      return new Promise<boolean>((resolve) => {
        const audio = audioRef.current;
        if (!audio) {
          setAudioLoading(false);
          resolve(false);
          return;
        }

        const onCanPlay = () => {
          audio.removeEventListener("canplaythrough", onCanPlay);
          audio.removeEventListener("error", onError);
          setLoadedSurahNum(surahNum);
          setLoadedQariId(qariId);
          setAudioLoading(false);
          resolve(true);
        };

        const onError = () => {
          audio.removeEventListener("canplaythrough", onCanPlay);
          audio.removeEventListener("error", onError);
          toast.error("هەڵەیەک ڕوویدا لە بارکردنی دەنگ");
          setAudioLoading(false);
          resolve(false);
        };

        audio.addEventListener("canplaythrough", onCanPlay);
        audio.addEventListener("error", onError);
        audio.src = selectedQari.getUrl(surahNum);
        audio.load();
      });
    },
    [loadedSurahNum, loadedQariId, selectedQari]
  );

  // Audio controls
  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !selectedSurah) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (loadedSurahNum !== selectedSurah.number || loadedQariId !== selectedQari.id) {
        const success = await loadAudio(selectedSurah.number, selectedQari.id);
        if (!success) return;
      }

      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        toast.error("نەتوانرا دەنگ لێبدرێت");
      }
    }
  }, [isPlaying, selectedSurah, loadedSurahNum, loadedQariId, selectedQari, loadAudio]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const seekAudio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setAudioCurrentTime(time);
  }, []);

  const skipBack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setAudioCurrentTime(0);
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Batch audio state reset when surah changes — single state transition
  useEffect(() => {
    if (selectedSurah === null) return;
    setIsPlaying(false);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setLoadedSurahNum(null);
    setLoadedQariId(null);
  }, [selectedSurah]);

  // Handle Qari change — batch reset without causing cascading renders
  const handleQariChange = useCallback(
    (qari: Qari) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
      // Batch all state updates
      setSelectedQari(qari);
      setIsPlaying(false);
      setAudioCurrentTime(0);
      setAudioDuration(0);
      setLoadedQariId(null);
      setLoadedSurahNum(null);
    },
    []
  );

  // Audio event handlers — stable reference
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isNaN(audio.currentTime) && !isNaN(audio.duration) && audio.duration > 0) {
        setAudioCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []); // Empty deps — audio ref is stable

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSurahList || loading) return;

      if (e.key === "ArrowLeft" && currentAyahIndex < ayahs.length - 1) {
        setCurrentAyahIndex((prev) => prev + 1);
      } else if (e.key === "ArrowRight" && currentAyahIndex > 0) {
        setCurrentAyahIndex((prev) => prev - 1);
      } else if (e.key === "Escape") {
        setShowSurahList(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSurahList, loading, currentAyahIndex, ayahs.length]);

  const handleSelectSurah = useCallback(
    async (surah: Surah) => {
      setSelectedSurah(surah);
      setShowSurahList(false);
      setLoading(true);
      setCurrentAyahIndex(0);

      // Prioritize parsing this surah's tafsir if full parse isn't done yet
      loadForSurah(surah.number);

      try {
        const arabicRes = await fetch(
          `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surah.number}`
        );
        const arabicData = await arabicRes.json();

        if (arabicData?.verses?.length > 0) {
          const combined = arabicData.verses.map(
            (verse: { id: number; verse_key: string; text_uthmani: string }) => {
              const ayahNum = parseInt(verse.verse_key.split(":")[1]);
              return {
                number: verse.id,
                numberInSurah: ayahNum,
                text: verse.text_uthmani,
                translation:
                  tafsirData[surah.number]?.[ayahNum] ||
                  "تەفسیر بەردەست نییە بۆ ئەم ئایەتە",
              };
            }
          );
          setAyahs(combined);
        } else {
          throw new Error("No verses found");
        }
      } catch {
        // Fallback construction
        const surahTafsir = tafsirData[surah.number] || {};
        const count = surah.numberOfAyahs;
        const fallback = Array.from({ length: count }, (_, i) => ({
          number: i + 1,
          numberInSurah: i + 1,
          text: `﴿ ${i + 1} ﴾`,
          translation: surahTafsir[i + 1] || "",
        }));
        setAyahs(fallback);
      } finally {
        setLoading(false);
      }
    },
    [tafsirData, loadForSurah]
  );

  const currentAyah = ayahs[currentAyahIndex];

  const copyAyah = useCallback(
    (ayah: AyahWithTranslation) => {
      const tafsirText = selectedSurah
        ? tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || ""
        : "";
      const text = `${ayah.text}\n\n${tafsirText}\n\n— ${selectedSurah?.name} (${ayah.numberInSurah})`;
      navigator.clipboard.writeText(text);
      toast.success("کۆپی کرا!");
    },
    [selectedSurah, tafsirData]
  );

  const shareAyah = useCallback(
    (ayah: AyahWithTranslation) => {
      const tafsirText = selectedSurah
        ? tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || ""
        : "";
      const text = `${ayah.text}\n\n${tafsirText}\n\n— ${selectedSurah?.name} (${ayah.numberInSurah})`;
      if (navigator.share) {
        navigator.share({
          title: `Quran: ${selectedSurah?.name}`,
          text: text,
        });
      } else {
        copyAyah(ayah);
      }
    },
    [selectedSurah, tafsirData, copyAyah]
  );

  const handlePrevAyah = useCallback(
    () => setCurrentAyahIndex((p) => Math.max(0, p - 1)),
    []
  );
  const handleNextAyah = useCallback(
    () => setCurrentAyahIndex((p) => Math.min(ayahs.length - 1, p + 1)),
    [ayahs.length]
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GeometricPattern />
      <Navigation />

      <main className="relative z-10 pt-20 sm:pt-24 pb-20 sm:pb-24 px-2 sm:px-4 md:px-6">
        <div className="w-full max-w-5xl mx-auto">
          {showSurahList ? (
            <SurahList
              surahs={surahs}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTafsir={selectedTafsir}
              setSelectedTafsir={setSelectedTafsir}
              tafsirLoaded={tafsirLoaded}
              onSelectSurah={handleSelectSurah}
            />
          ) : (
            <div>
              {/* Reading View Controls */}
              <div className="flex items-center justify-between mb-4 gap-4 sticky top-20 z-20 bg-background/80 backdrop-blur pb-2">
                <Button variant="ghost" onClick={() => setShowSurahList(true)} className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  لیست
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="text-right">ڕێکخستنەکان</SheetTitle>
                    </SheetHeader>
                    <QuranSettings
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                      selectedTafsir={selectedTafsir}
                      setSelectedTafsir={setSelectedTafsir}
                      selectedQari={selectedQari}
                      setSelectedQari={handleQariChange}
                      showTafsir={showTafsir}
                      setShowTafsir={setShowTafsir}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Card View */}
                  {viewMode === "card" && currentAyah && selectedSurah && (
                    <QuranCardView
                      currentAyah={currentAyah}
                      currentAyahIndex={currentAyahIndex}
                      totalAyahs={ayahs.length}
                      selectedSurah={selectedSurah}
                      tafsirData={tafsirData}
                      selectedTafsir={selectedTafsir}
                      showTafsir={showTafsir}
                      onCopyAyah={() => copyAyah(currentAyah)}
                      onShareAyah={() => shareAyah(currentAyah)}
                    />
                  )}

                  {/* List View */}
                  {viewMode === "list" && selectedSurah && (
                    <QuranListView
                      ayahs={ayahs}
                      selectedSurah={selectedSurah}
                      tafsirData={tafsirData}
                      showTafsir={showTafsir}
                    />
                  )}

                  {/* Book View */}
                  {viewMode === "book" && (
                    <QuranBookView
                      selectedSurah={selectedSurah}
                      paginatedPages={paginatedPages}
                      tafsirData={tafsirData}
                      selectedTafsir={selectedTafsir}
                      isPlaying={isPlaying}
                      audioCurrentTime={audioCurrentTime}
                      onTogglePlay={togglePlay}
                      formatTime={formatTime}
                      onExitBookView={() => setViewMode("list")}
                    />
                  )}

                  {/* Footer with Audio Player (Card and List Views only) */}
                  {viewMode !== "book" && (
                    <AudioPlayer
                      audioRef={audioRef}
                      selectedSurah={selectedSurah}
                      selectedQari={selectedQari}
                      isPlaying={isPlaying}
                      audioLoading={audioLoading}
                      audioCurrentTime={audioCurrentTime}
                      audioDuration={audioDuration}
                      isMuted={isMuted}
                      onTogglePlay={togglePlay}
                      onToggleMute={toggleMute}
                      onSeek={seekAudio}
                      onSkipBack={skipBack}
                      formatTime={formatTime}
                      getAudioUrl={getAudioUrl}
                      showAyahNav={viewMode === "card"}
                      currentAyahIndex={currentAyahIndex}
                      totalAyahs={ayahs.length}
                      onPrevAyah={handlePrevAyah}
                      onNextAyah={handleNextAyah}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
