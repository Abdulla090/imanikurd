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

            {/* Audio Player Bar */}
            <div className="px-4 py-2 border-b border-border/50">
                <div className="max-w-2xl mx-auto">
                    {/* Time and Controls Row */}
                    <div className="flex items-center justify-between gap-4">

                        {/* Controls Group */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Prev Ayah (Only in Card Mode) */}
                            {showAyahNav && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground"
                                    onClick={onPrevAyah}
                                    disabled={currentAyahIndex === 0}
                                    title="پێشوو"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            )}

                            {/* Play/Pause Button */}
                            <Button
                                variant="default"
                                size="icon"
                                className="h-10 w-10 rounded-full shadow-md"
                                onClick={onTogglePlay}
                                disabled={audioLoading}
                            >
                                {audioLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-5 h-5" />
                                ) : (
                                    <Play className="w-5 h-5 ml-0.5" />
                                )}
                            </Button>

                            {/* Next Ayah (Only in Card Mode) */}
                            {showAyahNav && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground"
                                    onClick={onNextAyah}
                                    disabled={currentAyahIndex === totalAyahs! - 1}
                                    title="دواتر"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            )}
                        </div>

                        {/* Progress Bar & Time */}
                        <div className="flex-1 flex flex-col justify-center gap-1">
                            <input
                                type="range"
                                min="0"
                                max={audioDuration || 100}
                                value={audioCurrentTime}
                                onChange={onSeek}
                                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground font-mono px-1">
                                <span>{formatTime(audioCurrentTime)}</span>
                                <span>{formatTime(audioDuration)}</span>
                            </div>
                        </div>

                        {/* Extra Controls (Mute, Skip, Download) */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground"
                                onClick={onSkipBack}
                            >
                                <SkipBack className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground"
                                onClick={onToggleMute}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
