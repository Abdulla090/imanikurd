import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Book, Loader2, BookOpen, ChevronLeft, ChevronRight, Copy, Check, Star, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Types
interface LocalHadith {
  id: number;
  title: string;
  arabic: string;
  kurdish: string;
  isFavorite: boolean;
}

interface DisplayHadith {
  id: number;
  title: string;
  arabic: string;
  kurdish: string;
  isFavorite: boolean;
}

export default function HadithPage() {
  const [hadiths, setHadiths] = useState<DisplayHadith[]>([]);
  const [filteredHadiths, setFilteredHadiths] = useState<DisplayHadith[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const itemsPerPage = 10;

  // Load hadiths from local JSON
  useEffect(() => {
    const loadHadiths = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/hadiths_kurdish.json');
        if (!response.ok) throw new Error('Failed to load hadiths');

        const data: LocalHadith[] = await response.json();
        setHadiths(data);
        setFilteredHadiths(data);
      } catch (error) {
        console.error("Error loading hadiths:", error);
        toast.error("هەڵە لە بارکردنی فەرموودەکان");
      } finally {
        setLoading(false);
      }
    };

    loadHadiths();
  }, []);

  // Filter hadiths based on search and favorites
  useEffect(() => {
    let filtered = hadiths;

    if (showFavoritesOnly) {
      filtered = filtered.filter(h => h.isFavorite);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h =>
        h.title.toLowerCase().includes(query) ||
        h.arabic.includes(searchQuery) ||
        h.kurdish.includes(searchQuery)
      );
    }

    setFilteredHadiths(filtered);
    setCurrentPage(1);
  }, [searchQuery, showFavoritesOnly, hadiths]);

  // Pagination
  const totalPages = Math.ceil(filteredHadiths.length / itemsPerPage);
  const paginatedHadiths = filteredHadiths.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyHadith = async (hadith: DisplayHadith) => {
    const text = `${hadith.arabic}\n\n${hadith.kurdish}\n\n— ${hadith.title}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    toast.success("فەرموودەکە کۆپی کرا", { duration: 1000 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareHadith = async (hadith: DisplayHadith) => {
    const text = `${hadith.arabic}\n\n${hadith.kurdish}\n\n— ${hadith.title}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: hadith.title || 'فەرموودە',
          text: text,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyHadith(hadith);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GeometricPattern />
      <Navigation />

      <main className="relative z-10 pt-20 sm:pt-24 pb-16 sm:pb-20 px-2 sm:px-4 md:px-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="font-naskh text-3xl md:text-4xl font-bold text-foreground mb-3">
              فەرموودەکانی پێغەمبەر ﷺ
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ٢٤٠ فەرموودە بە وەرگێڕانی کوردی سۆرانی لە کۆگای نوور
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="گەڕان لە فەرموودەکان..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-11"
                />
              </div>

              {/* Favorites Toggle */}
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="gap-2 h-11"
              >
                <Star className={cn("w-4 h-4", showFavoritesOnly && "fill-current")} />
                هەڵبژێردراوەکان
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filteredHadiths.length} فەرموودە
                {showFavoritesOnly && " (هەڵبژێردراو)"}
              </span>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-xs"
                >
                  پاککردنەوەی گەڕان
                </Button>
              )}
            </div>
          </motion.div>

          {/* Hadiths List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">چاوەڕوان بە...</p>
              </div>
            ) : paginatedHadiths.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  هیچ فەرموودەیەک نەدۆزرایەوە
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {paginatedHadiths.map((hadith, index) => (
                  <motion.div
                    key={hadith.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.03 }}
                    className="feature-card group p-4 sm:p-6"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Book className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title & Badge */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <h3 className="text-sm font-bold text-primary">
                            {hadith.title || `فەرموودەی ${hadith.id}`}
                          </h3>
                          {hadith.isFavorite && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          )}
                          <span className="text-xs text-muted-foreground">#{hadith.id}</span>
                        </div>

                        {/* Arabic Text */}
                        <p className="font-arabic text-xl sm:text-2xl text-foreground leading-loose mb-4 text-right">
                          {hadith.arabic}
                        </p>

                        {/* Kurdish Translation */}
                        {hadith.kurdish && (
                          <div className="bg-primary/5 rounded-xl p-4 mb-4 border-r-4 border-primary/30">
                            <p className="text-sm text-primary font-medium mb-1">وەرگێڕانی کوردی:</p>
                            <p className="text-foreground leading-relaxed">{hadith.kurdish}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyHadith(hadith)}
                            className="gap-2"
                          >
                            {copiedId === hadith.id ? (
                              <>
                                <Check className="w-4 h-4" />
                                کۆپی کرا
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                کۆپیکردن
                              </>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareHadith(hadith)}
                            className="gap-2"
                          >
                            <Share2 className="w-4 h-4" />
                            هاوبەشی
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 mt-8"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                {/* Show page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
