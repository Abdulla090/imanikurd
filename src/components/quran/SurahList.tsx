import { memo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TAFSIR_OPTIONS } from "./constants";
import { Surah, TafsirOption } from "./types";

interface SurahListProps {
    surahs: Surah[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedTafsir: string;
    setSelectedTafsir: (tafsir: string) => void;
    tafsirLoaded: boolean;
    onSelectSurah: (surah: Surah) => void;
}

export const SurahList = memo(function SurahList({
    surahs,
    searchQuery,
    setSearchQuery,
    selectedTafsir,
    setSelectedTafsir,
    tafsirLoaded,
    onSelectSurah
}: SurahListProps) {
    const filteredSurahs = surahs.filter(
        (surah) =>
            surah.name.includes(searchQuery) ||
            surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.number.toString().includes(searchQuery)
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
        >
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="گەڕان بۆ سورەت..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 h-10"
                    />
                </div>

                {/* Tafsir Selector */}
                <Select value={selectedTafsir} onValueChange={setSelectedTafsir}>
                    <SelectTrigger className="w-full sm:w-[200px] h-10">
                        <SelectValue placeholder="تەفسیر هەڵبژێرە" />
                    </SelectTrigger>
                    <SelectContent>
                        {TAFSIR_OPTIONS.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold">114 سورە</span>
                {tafsirLoaded && (
                    <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded-lg">✓ {TAFSIR_OPTIONS.find(t => t.id === selectedTafsir)?.name}</span>
                )}
            </div>

            {/* Surah List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-[75vh] overflow-y-auto scrollbar-thin p-1">
                {filteredSurahs.map((surah) => (
                    <button
                        key={surah.number}
                        onClick={() => onSelectSurah(surah)}
                        className="feature-card flex items-center gap-3 p-3 sm:p-4 text-right hover:border-primary/50 transition-all"
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 font-arabic text-sm">
                            {surah.number}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-arabic text-base sm:text-lg text-foreground truncate">{surah.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <span>{surah.numberOfAyahs} ئایەت</span>
                                <span>•</span>
                                <span className={surah.revelationType === "Meccan" ? "text-amber-600" : "text-emerald-600"}>
                                    {surah.revelationType === "Meccan" ? "مەککی" : "مەدەنی"}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
});
