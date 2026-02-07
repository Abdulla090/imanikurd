import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Import Quran components
import {
  Surah,
  AyahWithTranslation,
  TafsirData,
  Qari,
  TAFSIR_OPTIONS,
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
  const [surahs, setSurahs] = useState<Surah[]>(SURAHS_DATA);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<AyahWithTranslation[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSurahList, setShowSurahList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTafsir, setShowTafsir] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "list" | "book">("list");
  const [tafsirData, setTafsirData] = useState<TafsirData>({});
  const [tafsirLoaded, setTafsirLoaded] = useState(false);
  const [selectedTafsir, setSelectedTafsir] = useState("rebar");

  // Pagination Logic for Book View
  const paginatedPages = useMemo(() => {
    if (!ayahs.length) return [];

    const CHARS_PER_PAGE = 850;
    const pages: AyahWithTranslation[][] = [];
    let currentPage: AyahWithTranslation[] = [];
    let currentChars = 0;

    ayahs.forEach((ayah) => {
      if (currentChars + ayah.text.length > CHARS_PER_PAGE && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentChars = 0;
      }
      currentPage.push(ayah);
      currentChars += ayah.text.length;
    });

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
  const getAudioUrl = (surahNum: number) => selectedQari.getUrl(surahNum);

  // Load audio
  const loadAudio = async (surahNum: number, qariId: string): Promise<boolean> => {
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
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        setLoadedSurahNum(surahNum);
        setLoadedQariId(qariId);
        setAudioLoading(false);
        resolve(true);
      };

      const onError = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        toast.error('هەڵەیەک ڕوویدا لە بارکردنی دەنگ');
        setAudioLoading(false);
        resolve(false);
      };

      audio.addEventListener('canplaythrough', onCanPlay);
      audio.addEventListener('error', onError);
      audio.src = getAudioUrl(surahNum);
      audio.load();
    });
  };

  // Audio controls
  const togglePlay = async () => {
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
        toast.error('نەتوانرا دەنگ لێبدرێت');
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setAudioCurrentTime(time);
  };

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setAudioCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset audio state when surah changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setLoadedSurahNum(null);
    setLoadedQariId(null);
  }, [selectedSurah]);

  // Reset audio when qari changes
  useEffect(() => {
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setLoadedQariId(null);
    setLoadedSurahNum(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [selectedQari]);

  // Audio event handlers
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

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [loadedSurahNum]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSurahList || loading) return;

      if (e.key === "ArrowLeft" && currentAyahIndex < ayahs.length - 1) {
        setCurrentAyahIndex(prev => prev + 1);
      } else if (e.key === "ArrowRight" && currentAyahIndex > 0) {
        setCurrentAyahIndex(prev => prev - 1);
      } else if (e.key === "Escape") {
        setShowSurahList(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSurahList, loading, currentAyahIndex, ayahs.length]);

  // Load tafsir JSON
  const loadTafsirJSON = async (tafsirId: string) => {
    try {
      setTafsirLoaded(false);
      const response = await fetch(`/data/tafsir_${tafsirId}.json`);

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const rawData = await response.json();
      const parsedData: TafsirData = {};

      rawData.forEach((item: { s: string | number; a: number; t: string }) => {
        const surahNum = typeof item.s === 'string' ? parseInt(item.s, 10) : item.s;
        if (!parsedData[surahNum]) parsedData[surahNum] = {};
        parsedData[surahNum][item.a] = item.t;
      });

      setTafsirData(parsedData);
      setTafsirLoaded(true);
      toast.success("تەفسیر بارکرا", {
        description: TAFSIR_OPTIONS.find(t => t.id === tafsirId)?.name,
        duration: 1000
      });

      localStorage.setItem("selected-tafsir-id", tafsirId);
    } catch (err) {
      console.error("Failed to load tafsir:", err);
      toast.error("هەڵە لە بارکردنی تەفسیر");
    }
  };

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem("selected-tafsir-id");
    const validIds = TAFSIR_OPTIONS.map(t => t.id);
    const validSaved = saved && validIds.includes(saved) ? saved : "rebar";

    if (validSaved !== saved) {
      localStorage.removeItem("selected-tafsir-id");
    }

    setSelectedTafsir(validSaved);
    loadTafsirJSON(validSaved);
    fetchSurahs();
  }, []);

  // Watch for tafsir change
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    loadTafsirJSON(selectedTafsir);
  }, [selectedTafsir]);

  const fetchSurahs = async () => {
    try {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      if (data.code === 200) {
        setSurahs(data.data);
      }
    } catch {
      // Fallback to static data
    }
  };

  const handleSelectSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setShowSurahList(false);
    setLoading(true);
    setCurrentAyahIndex(0);

    try {
      const arabicRes = await fetch(
        `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surah.number}`
      );
      const arabicData = await arabicRes.json();

      if (arabicData?.verses?.length > 0) {
        const combined = arabicData.verses.map((verse: { id: number; verse_key: string; text_uthmani: string }) => {
          const ayahNum = parseInt(verse.verse_key.split(':')[1]);
          return {
            number: verse.id,
            numberInSurah: ayahNum,
            text: verse.text_uthmani,
            translation: tafsirData[surah.number]?.[ayahNum] || "تەفسیر بەردەست نییە بۆ ئەم ئایەتە",
          };
        });
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
        translation: surahTafsir[i + 1] || ""
      }));
      setAyahs(fallback);
    } finally {
      setLoading(false);
    }
  };

  const currentAyah = ayahs[currentAyahIndex];

  const copyAyah = (ayah: AyahWithTranslation) => {
    const tafsirText = selectedSurah ? (tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || "") : "";
    const text = `${ayah.text}\n\n${tafsirText}\n\n— ${selectedSurah?.name} (${ayah.numberInSurah})`;
    navigator.clipboard.writeText(text);
    toast.success("کۆپی کرا!");
  };

  const shareAyah = (ayah: AyahWithTranslation) => {
    const tafsirText = selectedSurah ? (tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || "") : "";
    const text = `${ayah.text}\n\n${tafsirText}\n\n— ${selectedSurah?.name} (${ayah.numberInSurah})`;
    if (navigator.share) {
      navigator.share({
        title: `Quran: ${selectedSurah?.name}`,
        text: text
      });
    } else {
      copyAyah(ayah);
    }
  };

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
                      setSelectedQari={setSelectedQari}
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
                      onPrevAyah={() => setCurrentAyahIndex(p => Math.max(0, p - 1))}
                      onNextAyah={() => setCurrentAyahIndex(p => Math.min(ayahs.length - 1, p + 1))}
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
