import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Eye, EyeOff, Maximize, Minimize, X, BookCopy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AyahWithTranslation, Surah, TafsirData } from "./types";
import { TAFSIR_OPTIONS } from "./constants";

interface QuranBookViewProps {
    selectedSurah: Surah | null;
    paginatedPages: AyahWithTranslation[][];
    tafsirData: TafsirData;
    selectedTafsir: string;
    isPlaying: boolean;
    audioCurrentTime: number;
    onTogglePlay: () => void;
    formatTime: (seconds: number) => string;
    onExitBookView: () => void;
}

export function QuranBookView({
    selectedSurah,
    paginatedPages,
    tafsirData,
    selectedTafsir,
    isPlaying,
    audioCurrentTime,
    onTogglePlay,
    formatTime,
    onExitBookView
}: QuranBookViewProps) {
    const [bookCurrentPage, setBookCurrentPage] = useState(0);
    const [showTafsir, setShowTafsir] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTwoPageLayout, setIsTwoPageLayout] = useState(true); // Default: two pages on desktop

    const totalPages = paginatedPages.length;

    // Fullscreen handling
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(console.error);
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            }).catch(console.error);
        }
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToNextPage();
            } else if (e.key === 'ArrowRight') {
                goToPrevPage();
            } else if (e.key === 'Escape' && isFullscreen) {
                document.exitFullscreen();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [bookCurrentPage, isFullscreen, showTafsir, totalPages]);

    const leftPageIndex = bookCurrentPage;
    const rightPageIndex = bookCurrentPage + 1;

    const goToNextPage = () => {
        const increment = (isTwoPageLayout && !showTafsir) ? 2 : 1;
        setBookCurrentPage(prev => Math.min(totalPages - 1, prev + increment));
    };

    const goToPrevPage = () => {
        const decrement = (isTwoPageLayout && !showTafsir) ? 2 : 1;
        setBookCurrentPage(prev => Math.max(0, prev - decrement));
    };

    // Render a single page of Quran text
    const renderQuranPage = (pageIndex: number) => {
        const pageData = paginatedPages[pageIndex];

        if (!pageData) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center opacity-60">
                        <div className="mb-3 text-5xl lg:text-6xl text-primary/30">﷽</div>
                        <p className="text-muted-foreground font-arabic text-sm">کۆتایی سورە</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-full">
                {/* Bismillah & Header (Only on first page of Surah) */}
                {pageIndex === 0 && selectedSurah?.number !== 1 && selectedSurah?.number !== 9 && (
                    <div className="text-center mb-6 lg:mb-8 pb-4 border-b border-border/50">
                        <div className="inline-block px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
                            <p className="font-arabic text-lg lg:text-2xl text-primary">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                        </div>
                    </div>
                )}

                {pageIndex === 0 && (
                    <div className="text-center mb-4 lg:mb-6">
                        <span className="font-arabic text-base lg:text-lg text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                            سورەتی {selectedSurah?.name}
                        </span>
                    </div>
                )}

                {/* Quran Text - Real Book Style */}
                <div className="text-right leading-[2.6] lg:leading-[3]" dir="rtl">
                    {pageData.map((ayah) => (
                        <span key={ayah.number} className="inline">
                            <span
                                className="font-arabic text-lg lg:text-xl xl:text-2xl text-foreground"
                                style={{ fontFeatureSettings: '"liga" 1', wordSpacing: '0.05em' }}
                            >
                                {ayah.text}
                            </span>
                            <span className="inline-flex items-center justify-center mx-1 w-6 h-6 lg:w-7 lg:h-7 text-[10px] lg:text-xs font-bold rounded-full bg-primary text-primary-foreground align-middle">
                                {ayah.numberInSurah}
                            </span>
                            {" "}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    // Render tafsir page
    const renderTafsirPage = (pageIndex: number) => {
        const pageData = paginatedPages[pageIndex];

        if (!pageData) return null;

        return (
            <div className="space-y-4 text-right" dir="rtl">
                <h3 className="text-center font-arabic text-base lg:text-lg text-primary mb-4 pb-2 border-b border-border/50">
                    تەفسیری {TAFSIR_OPTIONS.find(t => t.id === selectedTafsir)?.name}
                </h3>
                {pageData.map((ayah) => (
                    <div key={`tafsir-${ayah.number}`} className="pb-3 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] lg:text-[11px] font-bold shrink-0">
                                {ayah.numberInSurah}
                            </span>
                            <span className="text-xs text-muted-foreground font-arabic truncate">
                                {ayah.text.substring(0, 25)}...
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mr-7">
                            {selectedSurah && tafsirData[selectedSurah.number]?.[ayah.numberInSurah] || "تەفسیر بەردەست نییە..."}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={cn(
            "fixed inset-0 z-50 bg-background overflow-hidden flex flex-col",
            isFullscreen ? "bg-background" : ""
        )}>
            {/* Book Header - Higher z-index to stay on top */}
            <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 py-2 sm:py-2.5 bg-card border-b border-border shrink-0 z-[60]" style={{ minHeight: '52px' }}>
                {/* Exit Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExitBookView}
                    className="text-muted-foreground hover:text-foreground gap-1.5"
                >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">گەڕانەوە</span>
                </Button>

                {/* Center - Surah Name & Page Info */}
                <div className="text-center flex-1">
                    <h2 className="font-arabic text-lg lg:text-xl text-foreground">{selectedSurah?.name}</h2>
                    <p className="text-xs text-muted-foreground">
                        پەڕە {bookCurrentPage + 1} لە {totalPages}
                    </p>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Toggle Tafsir Button */}
                    <Button
                        variant={showTafsir ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowTafsir(!showTafsir)}
                        className="gap-1 h-8 px-2 sm:px-3"
                    >
                        {showTafsir ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline text-xs">{showTafsir ? "تەفسیر" : "قورئان"}</span>
                    </Button>

                    {/* Page Layout Toggle - visible on larger screens */}
                    <Button
                        variant={isTwoPageLayout ? "outline" : "default"}
                        size="sm"
                        onClick={() => setIsTwoPageLayout(!isTwoPageLayout)}
                        className="h-8 px-2 sm:px-3 gap-1 hidden md:flex items-center"
                        title={isTwoPageLayout ? "یەک پەڕە" : "دوو پەڕە"}
                    >
                        {isTwoPageLayout ? <FileText className="w-3.5 h-3.5" /> : <BookCopy className="w-3.5 h-3.5" />}
                        <span className="hidden lg:inline text-xs">{isTwoPageLayout ? "١" : "٢"}</span>
                    </Button>

                    {/* Fullscreen Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="h-8 w-8 p-0"
                        title={isFullscreen ? "دەرچوون لە تەواوی شاشە" : "تەواوی شاشە"}
                    >
                        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                    </Button>
                </div>
            </div>

            {/* Main Book Content Area - with proper spacing for header */}
            <div className="flex-1 relative flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden bg-muted/30">

                {/* Navigation Buttons (Floating) - RTL: Right is Previous, Left is Next */}
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-1 sm:left-3 lg:left-6 z-10 h-10 w-10 lg:h-12 lg:w-12 rounded-full shadow-lg border border-border"
                    onClick={goToNextPage}
                    disabled={bookCurrentPage >= totalPages - ((isTwoPageLayout && !showTafsir) ? 2 : 1)}
                >
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                </Button>

                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-1 sm:right-3 lg:right-6 z-10 h-10 w-10 lg:h-12 lg:w-12 rounded-full shadow-lg border border-border"
                    onClick={goToPrevPage}
                    disabled={bookCurrentPage === 0}
                >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                </Button>

                {/* Book Spread Container */}
                <div className="flex gap-0 h-full max-h-[calc(100vh-140px)] w-full max-w-[1600px] justify-center">

                    {/* Single Page Mode (Mobile/Tablet always, Desktop when isTwoPageLayout is false) */}
                    <div className={cn(
                        "w-full h-full mx-auto",
                        isTwoPageLayout
                            ? "lg:hidden max-w-lg sm:max-w-xl" // Only show on mobile/tablet when two-page is enabled
                            : "max-w-3xl" // Full width single page on desktop
                    )}>
                        <div className="relative h-full bg-card border border-border shadow-xl overflow-hidden flex flex-col rounded-xl">
                            {/* Decorative Top Border */}
                            <div className="h-1.5 shrink-0 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40"></div>

                            {/* Scrollable Page Content */}
                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
                                {showTafsir ? renderTafsirPage(bookCurrentPage) : renderQuranPage(bookCurrentPage)}
                            </div>

                            {/* Page Footer */}
                            <div className="h-10 sm:h-12 shrink-0 flex items-center justify-between px-4 sm:px-6 border-t border-border bg-muted/50">
                                <span className="text-xs text-muted-foreground font-arabic">{selectedSurah?.name}</span>
                                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                    {bookCurrentPage + 1}
                                </span>
                                <span className="text-xs text-muted-foreground">{totalPages} پەڕە</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop: Two Page Spread (only if isTwoPageLayout is true) */}
                    {isTwoPageLayout && <div className="hidden lg:flex gap-0 h-full w-full max-w-[1500px]">

                        {/* Right Page (Page N) - In RTL this is the first page */}
                        <div className="w-1/2 h-full bg-card border border-border border-l-0 shadow-xl overflow-hidden flex flex-col rounded-r-xl">
                            {/* Decorative Top */}
                            <div className="h-2 shrink-0 bg-gradient-to-l from-primary/50 via-primary/30 to-transparent"></div>

                            {/* Page Content */}
                            <div className="flex-1 overflow-y-auto px-6 xl:px-8 py-6 custom-scrollbar">
                                {showTafsir ? renderTafsirPage(leftPageIndex) : renderQuranPage(leftPageIndex)}
                            </div>

                            {/* Page Footer with Number */}
                            <div className="h-12 shrink-0 flex items-center justify-between px-6 border-t border-border bg-muted/30">
                                <span className="text-xs text-muted-foreground font-arabic">{selectedSurah?.name}</span>
                                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                    {leftPageIndex + 1}
                                </span>
                                <span className="text-xs text-muted-foreground opacity-50">—</span>
                            </div>
                        </div>

                        {/* Center Spine - Book Binding */}
                        <div className="w-6 xl:w-8 bg-gradient-to-r from-muted via-background to-muted shadow-inner z-20 shrink-0 flex flex-col items-center justify-center relative border-x border-border">
                            <div className="absolute inset-y-8 w-0.5 bg-border/50 rounded-full"></div>
                        </div>

                        {/* Left Page (Page N+1) - In RTL this is the second page */}
                        <div className="w-1/2 h-full bg-card border border-border border-r-0 shadow-xl overflow-hidden flex flex-col rounded-l-xl">
                            {/* Decorative Top */}
                            <div className="h-2 shrink-0 bg-gradient-to-r from-primary/50 via-primary/30 to-transparent"></div>

                            {/* Page Content */}
                            <div className="flex-1 overflow-y-auto px-6 xl:px-8 py-6 custom-scrollbar">
                                {showTafsir
                                    ? renderTafsirPage(rightPageIndex)
                                    : (paginatedPages[rightPageIndex] ? renderQuranPage(rightPageIndex) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center opacity-50">
                                                <div className="mb-3 text-6xl text-primary/20">﷽</div>
                                                <p className="text-muted-foreground font-arabic">کۆتایی سورە</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            {/* Page Footer with Number */}
                            <div className="h-12 shrink-0 flex items-center justify-between px-6 border-t border-border bg-muted/30">
                                <span className="text-xs text-muted-foreground opacity-50">—</span>
                                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                    {showTafsir ? "ت" : (paginatedPages[rightPageIndex] ? rightPageIndex + 1 : "—")}
                                </span>
                                <span className="text-xs text-muted-foreground">{totalPages} پەڕە</span>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

            {/* Floating Audio & Navigation Controls */}
            <div className="absolute bottom-3 lg:bottom-5 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-5 py-2 rounded-full bg-card/95 backdrop-blur-sm shadow-xl border border-border">
                    {/* Play/Pause */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 lg:h-9 lg:w-9 rounded-full hover:bg-primary/10"
                        onClick={onTogglePlay}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </Button>

                    <span className="text-[10px] lg:text-xs text-muted-foreground font-mono min-w-[45px] text-center">
                        {formatTime(audioCurrentTime)}
                    </span>

                    {/* Divider */}
                    <div className="w-px h-5 bg-border"></div>

                    {/* Page Navigation */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 lg:h-8 lg:w-8 rounded-full hover:bg-primary/10"
                            onClick={goToPrevPage}
                            disabled={bookCurrentPage === 0}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>

                        <span className="text-xs lg:text-sm font-medium text-foreground min-w-[50px] lg:min-w-[60px] text-center">
                            {bookCurrentPage + 1} / {totalPages}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 lg:h-8 lg:w-8 rounded-full hover:bg-primary/10"
                            onClick={goToNextPage}
                            disabled={bookCurrentPage >= totalPages - 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
