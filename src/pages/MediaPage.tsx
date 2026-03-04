import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink, Search, Radio, Tv, Headphones, Music, BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import {
    mediaItems,
    categories,
    getThumbnail,
    getEmbedUrl,
    getYouTubeSearchUrl,
    searchQueries,
    type MediaItem,
} from "@/data/islamicMedia";

const categoryIcons: Record<string, React.ReactNode> = {
    "all": <Tv className="w-4 h-4" />,
    "quran": <BookOpen className="w-4 h-4" />,
    "lecture-ku": <Radio className="w-4 h-4" />,
    "lecture-ar": <Radio className="w-4 h-4" />,
    "podcast": <Headphones className="w-4 h-4" />,
    "nasheed": <Music className="w-4 h-4" />,
};

const categoryGradients: Record<string, string> = {
    "quran": "from-emerald-600 to-green-700",
    "lecture-ku": "from-blue-600 to-indigo-700",
    "lecture-ar": "from-purple-600 to-violet-700",
    "podcast": "from-orange-600 to-amber-700",
    "nasheed": "from-pink-600 to-rose-700",
};

export default function MediaPage() {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [playingVideo, setPlayingVideo] = useState<MediaItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [language, setLanguage] = useState<"ku" | "en">("ku");

    const filteredItems = mediaItems.filter((item) => {
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesSearch =
            searchTerm === "" ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.titleKu.includes(searchTerm) ||
            item.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.channelKu.includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    const handlePlay = useCallback((item: MediaItem) => {
        setPlayingVideo(item);
        document.body.style.overflow = "hidden";
    }, []);

    const handleClose = useCallback(() => {
        setPlayingVideo(null);
        document.body.style.overflow = "";
    }, []);

    const openYouTubeSearch = () => {
        const query = searchQueries[activeCategory] || searchQueries["all"];
        window.open(getYouTubeSearchUrl(searchTerm || query), "_blank");
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-2 sm:px-4 md:px-6">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6 border border-red-500/10"
                        >
                            <Tv className="w-10 h-10 text-red-500" />
                        </motion.div>

                        <h1 className="font-naskh text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
                            {language === "ku" ? "میدیای ئیسلامی" : "Islamic Media"}
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                            {language === "ku"
                                ? "پۆدکاست، وتار، تلاوەتی قورئان و نەشید بە کوردی و عەرەبی"
                                : "Podcasts, lectures, Quran recitation and nasheeds in Kurdish & Arabic"}
                        </p>

                        {/* Language Toggle */}
                        <div className="flex justify-center mt-4">
                            <div className="flex bg-muted/50 rounded-lg p-1">
                                <button
                                    onClick={() => setLanguage("ku")}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${language === "ku"
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    کوردی
                                </button>
                                <button
                                    onClick={() => setLanguage("en")}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${language === "en"
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    English
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-xl mx-auto mb-8"
                    >
                        <div className="relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={language === "ku" ? "گەڕان لە ناوەڕۆکەکان..." : "Search content..."}
                                className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-card border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none text-sm transition-all placeholder:text-muted-foreground/60"
                                dir="auto"
                            />
                        </div>
                    </motion.div>

                    {/* Category Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8 sm:mb-10"
                    >
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
                            <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${activeCategory === cat.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                                        }`}
                                >
                                    {categoryIcons[cat.id]}
                                    <span>{language === "ku" ? cat.nameKu : cat.nameEn}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-between mb-6 px-1"
                    >
                        <p className="text-sm text-muted-foreground">
                            {language === "ku"
                                ? `${filteredItems.length} ناوەڕۆک`
                                : `${filteredItems.length} items`}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openYouTubeSearch}
                            className="gap-2 text-xs rounded-xl"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {language === "ku" ? "زیاتر لە یوتیوب" : "More on YouTube"}
                        </Button>
                    </motion.div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                                whileHover={{ y: -4 }}
                                className="group cursor-pointer"
                                onClick={() => handlePlay(item)}
                            >
                                <div className="glass-card rounded-2xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                        <img
                                            src={getThumbnail(item.id)}
                                            alt={item.titleKu}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const fallback = target.nextElementSibling as HTMLElement;
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                        {/* Fallback thumbnail */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 items-center justify-center hidden">
                                            <Play className="w-10 h-10 text-white/70" />
                                        </div>
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                whileHover={{ scale: 1.1 }}
                                                className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl"
                                            >
                                                <Play className="w-6 h-6 ml-0.5" fill="white" />
                                            </motion.div>
                                        </div>

                                        {/* Category Badge */}
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg bg-gradient-to-r ${categoryGradients[item.category]} text-white text-[10px] font-medium shadow-lg`}>
                                            {categories.find((c) => c.id === item.category)?.icon}{" "}
                                            {language === "ku"
                                                ? categories.find((c) => c.id === item.category)?.nameKu
                                                : categories.find((c) => c.id === item.category)?.nameEn}
                                        </div>

                                        {/* Duration/Language Indicator */}
                                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                                            {item.language === "ku" ? "کوردی" : item.language === "ar" ? "عربی" : "EN"}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3.5">
                                        <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                                            {language === "ku" ? item.titleKu : item.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-[8px]">
                                                ☪
                                            </span>
                                            {language === "ku" ? item.channelKu : item.channel}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-naskh text-xl mb-2">
                                {language === "ku" ? "هیچ ناوەڕۆکێک نەدۆزرایەوە" : "No content found"}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                {language === "ku" ? "گەڕانەکەت بگۆڕە یان جۆرێکی دیگە هەڵبژێرە" : "Try a different search or category"}
                            </p>
                            <Button onClick={openYouTubeSearch} className="gap-2 rounded-xl">
                                <ExternalLink className="w-4 h-4" />
                                {language === "ku" ? "گەڕان لە یوتیوب" : "Search YouTube"}
                            </Button>
                        </motion.div>
                    )}

                    {/* Load More from YouTube */}
                    {filteredItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center mt-12"
                        >
                            <div className="glass-card inline-block rounded-2xl p-6 sm:p-8 border border-border/30">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </div>
                                <h3 className="font-naskh text-lg font-bold mb-1">
                                    {language === "ku" ? "ناوەڕۆکی زیاتر لە یوتیوب" : "More Content on YouTube"}
                                </h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {language === "ku"
                                        ? "سەردانی یوتیوب بکە بۆ ناوەڕۆکی ئیسلامی زیاتر"
                                        : "Visit YouTube for more Islamic content"}
                                </p>
                                <Button
                                    onClick={openYouTubeSearch}
                                    className="gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {language === "ku" ? "چوون بۆ یوتیوب" : "Go to YouTube"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Video Player Modal */}
            <AnimatePresence>
                {playingVideo && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />

                        {/* Player */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="fixed inset-4 sm:inset-[8%] md:inset-[10%] lg:inset-[12%] z-50 flex flex-col"
                        >
                            {/* Close Button */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-white">
                                    <h3 className="font-medium text-sm sm:text-base line-clamp-1">
                                        {language === "ku" ? playingVideo.titleKu : playingVideo.title}
                                    </h3>
                                    <p className="text-xs text-white/60">
                                        {language === "ku" ? playingVideo.channelKu : playingVideo.channel}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${playingVideo.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={handleClose}
                                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Iframe */}
                            <div className="flex-1 rounded-2xl overflow-hidden bg-black shadow-2xl">
                                <iframe
                                    src={getEmbedUrl(playingVideo.id)}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={playingVideo.title}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
