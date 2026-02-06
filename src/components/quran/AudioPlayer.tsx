import { Loader2, Play, Pause, Volume2, VolumeX, SkipBack, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Qari, Surah } from "./types";
import { QARI_OPTIONS } from "./constants";

interface AudioPlayerProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    selectedSurah: Surah | null;
    selectedQari: Qari;
    setSelectedQari: (qari: Qari) => void;
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

export function AudioPlayer({
    audioRef,
    selectedSurah,
    selectedQari,
    setSelectedQari,
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
                    {/* Reciter Selector and Time */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                {audioLoading ? (
                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                ) : (
                                    <Volume2 className="w-4 h-4 text-primary" />
                                )}
                            </div>
                            {/* Qari Selector Dropdown */}
                            <Select
                                value={selectedQari.id}
                                onValueChange={(val) => {
                                    const qari = QARI_OPTIONS.find(q => q.id === val);
                                    if (qari) {
                                        setSelectedQari(qari);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-[160px] h-8 text-xs bg-background/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {QARI_OPTIONS.map((qari) => (
                                        <SelectItem key={qari.id} value={qari.id} className="text-xs">
                                            <div className="flex flex-col">
                                                <span>{qari.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                            <span>{formatTime(audioCurrentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(audioDuration)}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <input
                        type="range"
                        min="0"
                        max={audioDuration || 100}
                        value={audioCurrentTime}
                        onChange={onSeek}
                        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />

                    {/* Audio Controls */}
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onToggleMute}
                        >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onSkipBack}
                        >
                            <SkipBack className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="default"
                            size="icon"
                            className="h-12 w-12 rounded-full"
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

                        {/* Download Button */}
                        <a
                            href={selectedSurah ? getAudioUrl(selectedSurah.number) : '#'}
                            download={selectedSurah ? `${selectedSurah.number.toString().padStart(3, '0')}_${selectedSurah.englishName}.mp3` : 'surah.mp3'}
                            className="inline-flex"
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                title="داونلۆد"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            {/* Ayah Navigation (Card Mode only) */}
            {showAyahNav && (
                <div className="px-4 py-3">
                    <div className="max-w-md mx-auto flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={onPrevAyah}
                            disabled={currentAyahIndex === 0}
                        >
                            <ChevronRight className="w-5 h-5 ml-1" /> پێشوو
                        </Button>

                        <span className="text-sm font-mono opacity-50">{currentAyahIndex + 1} / {totalAyahs}</span>

                        <Button
                            variant="default"
                            className="flex-1"
                            onClick={onNextAyah}
                            disabled={currentAyahIndex === totalAyahs - 1}
                        >
                            دواتر <ChevronLeft className="w-5 h-5 mr-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
