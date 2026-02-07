import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, FileText, Headphones, Video, Search, ChevronLeft, ExternalLink, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { islamhouseApi, type IslamHouseItem, type ContentType } from "@/lib/islamhouse-api";

// Static fallback data in case API fails
const FALLBACK_MESSAGE = "ببوورە، ئێستا ناتوانین پەیوەندی بە سێرڤەرەوە بکەین. تکایە دواتر هەوڵبدەوە.";

interface ContentTab {
    id: ContentType;
    label: string;
    icon: typeof Book;
    kurdishLabel: string;
}

const contentTabs: ContentTab[] = [
    { id: "book", label: "Books", icon: Book, kurdishLabel: "کتێبەکان" },
    { id: "articles", label: "Articles", icon: FileText, kurdishLabel: "وتارەکان" },
    { id: "audio", label: "Audio", icon: Headphones, kurdishLabel: "دەنگییەکان" },
    { id: "video", label: "Video", icon: Video, kurdishLabel: "ڤیدیۆکان" },
];

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<ContentType>("book");
    const [items, setItems] = useState<IslamHouseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<IslamHouseItem | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch content when tab changes
    useEffect(() => {
        fetchContent();
    }, [activeTab]);

    const fetchContent = async (reset = true) => {
        try {
            setLoading(true);
            setError(null);

            const currentPage = reset ? 1 : page;
            if (reset) setPage(1);

            let data: IslamHouseItem[];

            switch (activeTab) {
                case "book":
                    data = await islamhouseApi.getBooks(currentPage, 20);
                    break;
                case "articles":
                    data = await islamhouseApi.getArticles(currentPage, 20);
                    break;
                case "audio":
                    data = await islamhouseApi.getAudio(currentPage, 20);
                    break;
                case "video":
                    data = await islamhouseApi.getVideos(currentPage, 20);
                    break;
                default:
                    data = await islamhouseApi.getItems(activeTab, "ku", "showall", currentPage, 20);
            }

            if (reset) {
                setItems(data || []);
            } else {
                setItems(prev => [...prev, ...(data || [])]);
            }

            setHasMore((data?.length || 0) >= 20);
        } catch (err) {
            console.error("Error fetching content:", err);
            setError(FALLBACK_MESSAGE);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchContent();
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await islamhouseApi.searchItems(searchQuery, "ku", activeTab);
            setItems(data || []);
            setHasMore(false);
        } catch (err) {
            console.error("Search error:", err);
            setError(FALLBACK_MESSAGE);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
        fetchContent(false);
    };

    const getTabIcon = (tabId: ContentType) => {
        const tab = contentTabs.find(t => t.id === tabId);
        return tab?.icon || Book;
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
                            <Book className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="font-naskh text-3xl md:text-4xl font-bold text-foreground mb-2">
                            کتێبخانەی ئیسلامی
                        </h1>
                        <p className="text-muted-foreground">
                            کتێب، وتار، دەنگ و ڤیدیۆی ئیسلامی بە کوردی
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                            سەرچاوە: IslamHouse.com
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl mx-auto mb-8"
                    >
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="گەڕان..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pr-10 h-12 rounded-xl bg-card/50 border-border/50"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90"
                            >
                                گەڕان
                            </Button>
                        </div>
                    </motion.div>

                    {/* Content Tabs */}
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType)} className="w-full">
                        <TabsList className="w-full max-w-lg mx-auto grid grid-cols-4 h-14 mb-8 bg-card/50 rounded-2xl p-1">
                            {contentTabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="flex flex-col items-center gap-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="text-[10px]">{tab.kurdishLabel}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Content Area */}
                        {contentTabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className="mt-0">
                                {loading && items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                        <p className="text-muted-foreground">چاوەڕێ بکە...</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                                        <p className="text-muted-foreground mb-4">{error}</p>
                                        <Button onClick={() => fetchContent()} variant="outline" className="gap-2">
                                            <RefreshCw className="w-4 h-4" />
                                            هەوڵی دووبارە
                                        </Button>
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <tab.icon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                        <p className="text-muted-foreground">هیچ ناوەڕۆکێک نەدۆزرایەوە</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <AnimatePresence mode="popLayout">
                                                {items.map((item, index) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        onClick={() => setSelectedItem(item)}
                                                        className="group p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 cursor-pointer transition-all"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                                <tab.icon className="w-6 h-6 text-primary" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                                    {item.title}
                                                                </h3>
                                                                {item.description && (
                                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                                        {item.description}
                                                                    </p>
                                                                )}
                                                                {item.prepared_by && item.prepared_by.length > 0 && (
                                                                    <p className="text-xs text-primary/70 mt-2">
                                                                        {item.prepared_by[0].title}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        {/* Load More */}
                                        {hasMore && (
                                            <div className="flex justify-center mt-8">
                                                <Button
                                                    onClick={loadMore}
                                                    variant="outline"
                                                    disabled={loading}
                                                    className="gap-2"
                                                >
                                                    {loading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <ChevronLeft className="w-4 h-4 rotate-90" />
                                                    )}
                                                    زیاتر ببینە
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>

            {/* Item Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    {(() => {
                                        const Icon = getTabIcon(activeTab);
                                        return <Icon className="w-6 h-6 text-primary" />;
                                    })()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-xl text-foreground">{selectedItem.title}</h2>
                                    {selectedItem.prepared_by && selectedItem.prepared_by.length > 0 && (
                                        <p className="text-sm text-primary">{selectedItem.prepared_by[0].title}</p>
                                    )}
                                </div>
                            </div>

                            {selectedItem.description && (
                                <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
                            )}

                            {selectedItem.full_description && (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none mb-4"
                                    dangerouslySetInnerHTML={{ __html: selectedItem.full_description }}
                                />
                            )}

                            {/* Attachments */}
                            {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <h3 className="font-semibold text-sm text-foreground">داگرتن:</h3>
                                    {selectedItem.attachments.map((attachment, idx) => (
                                        <a
                                            key={idx}
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-foreground flex-1">
                                                {attachment.description || `فایل ${idx + 1}`}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {attachment.extension_type?.toUpperCase()}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            )}

                            <Button
                                onClick={() => setSelectedItem(null)}
                                className="w-full mt-4"
                            >
                                داخستن
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
