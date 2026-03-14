import { memo } from "react";
import { Loader2, Play, Pause, Volume2, VolumeX, SkipBack, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Qari, Surah } from "./types";

interface AudioPlayerProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    selectedSurah: Surah | null;
    selectedQari: Qari;
    // setSelectedQari removed as it is handled in settings
    isPlaying: boolean;
    audioLoading: boolean;
    audioCurrentTime: number;
    audioDuration: number;
    isMuted: boolean;
    onTogglePlay: () => void;
    onToggleMute: () => void;
    onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSkipBack: () => void;
    formatTime: (seconds: number) => string;
    getAudioUrl: (surahNum: number) => string;
    // Optional ayah navigation for card mode
    showAyahNav?: boolean;
    currentAyahIndex?: number;
    totalAyahs?: number;
    onPrevAyah?: () => void;
    onNextAyah?: () => void;
}

export const AudioPlayer = memo(function AudioPlayer({
    audioRef,
    selectedSurah,
    selectedQari,
    // setSelectedQari,
    isPlaying,
    audioLoading,
    audioCurrentTime,
    audioDuration,
    isMuted,
    onTogglePlay,
    onToggleMute,
    onSeek,
    onSkipBack,
    formatTime,
    getAudioUrl,
    showAyahNav = false,
    currentAyahIndex = 0,
    totalAyahs = 0,
    onPrevAyah,
    onNextAyah
}: AudioPlayerProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50">
            {/* Audio Element */}
            <audio ref={audioRef} preload="none" crossOrigin="anonymous" />

            <div className="px-4 py-3 pb-6 sm:pb-3">
                <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
                    {/* Prev Ayah */}
                    <div className="flex-1 flex justify-end">
                        {showAyahNav && (
                            <Button
                                variant="outline"
                                className="w-full max-w-[140px] h-12 sm:h-14 rounded-2xl flex items-center justify-center gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all font-naskh font-bold text-foreground text-sm sm:text-base active:scale-95 shadow-sm"
                                onClick={onPrevAyah}
                                disabled={currentAyahIndex === 0}
                            >
                                <ChevronRight className="w-5 h-5 shrink-0" />
                                <span>رابردوو</span>
                            </Button>
                        )}
                    </div>

                    {/* Play Area */}
                    <div className="flex flex-col items-center shrink-0 min-w-[100px]">
                        <div className="text-[11px] sm:text-xs text-muted-foreground font-mono mb-2 bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                            {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
                        </div>
                        <Button
                            variant="default"
                            size="icon"
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gradient-to-br from-primary to-accent hover:opacity-90 hover:scale-105 active:scale-95 transition-all text-primary-foreground border-2 border-primary/20"
                            onClick={onTogglePlay}
                            disabled={audioLoading}
                        >
                            {audioLoading ? (
                                <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
                            ) : (
                                <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1" />
                            )}
                        </Button>
                    </div>

                    {/* Next Ayah */}
                    <div className="flex-1 flex justify-start">
                        {showAyahNav && (
                            <Button
                                variant="outline"
                                className="w-full max-w-[140px] h-12 sm:h-14 rounded-2xl flex items-center justify-center gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all font-naskh font-bold text-foreground text-sm sm:text-base active:scale-95 shadow-sm"
                                onClick={onNextAyah}
                                disabled={currentAyahIndex === totalAyahs! - 1}
                            >
                                <span>داهاتوو</span>
                                <ChevronLeft className="w-5 h-5 shrink-0" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});
