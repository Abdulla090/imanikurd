import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, FileText, Headphones, Video, Search, Download, ExternalLink, Loader2, AlertCircle, RefreshCw, Library, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Types
interface LibraryItem {
    id: number;
    title: string;
    author: string;
    description: string;
    category?: string;
    downloadUrl?: string | null;
    pages?: number;
}

interface ExternalLibrary {
    id: number;
    name: string;
    nameEn: string;
    url: string;
    description: string;
    icon: string;
}

interface LibraryData {
    books: LibraryItem[];
    articles: LibraryItem[];
    audio: LibraryItem[];
    videos: LibraryItem[];
    externalLibraries?: ExternalLibrary[];
}

type ContentType = "books" | "articles" | "audio" | "videos" | "external";

interface ContentTab {
    id: ContentType;
    label: string;
    icon: typeof Book;
    kurdishLabel: string;
}

const contentTabs: ContentTab[] = [
    { id: "books", label: "Books", icon: Book, kurdishLabel: "کتێبەکان" },
    { id: "articles", label: "Articles", icon: FileText, kurdishLabel: "وتارەکان" },
    { id: "audio", label: "Audio", icon: Headphones, kurdishLabel: "دەنگییەکان" },
    { id: "videos", label: "Video", icon: Video, kurdishLabel: "ڤیدیۆکان" },
    { id: "external", label: "External", icon: Globe, kurdishLabel: "کتێبخانەکان" },
];

// Category colors for visual distinction
const categoryColors: Record<string, string> = {
    "حەدیس": "from-amber-500 to-orange-600",
    "فیقه": "from-emerald-500 to-teal-600",
    "عەقیدە": "from-blue-500 to-indigo-600",
    "سیرە": "from-purple-500 to-violet-600",
    "تەفسیر": "from-rose-500 to-pink-600",
    "ئەزکار": "from-cyan-500 to-sky-600",
};

const getCategoryColor = (category?: string) => {
    if (!category) return "from-primary to-primary/80";
    return categoryColors[category] || "from-primary to-primary/80";
};

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<ContentType>("books");
    const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Fetch library data on mount
    useEffect(() => {
        fetchLibraryData();
    }, []);

    const fetchLibraryData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.BASE_URL}data/library.json`);
            if (!response.ok) {
                throw new Error("Failed to load library data");
            }

            const data: LibraryData = await response.json();
            setLibraryData(data);
        } catch (err) {
            console.error("Error loading library:", err);
            setError("ببوورە، ناتوانین داتاکان بخوێنینەوە");
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories from books
    const getCategories = (): string[] => {
        if (!libraryData?.books) return [];
        const categories = libraryData.books
            .map(book => book.category)
            .filter((cat): cat is string => !!cat);
        return [...new Set(categories)];
    };

    // Get items for current tab
    const getCurrentItems = (): LibraryItem[] => {
        if (!libraryData || activeTab === "external") return [];
        return libraryData[activeTab] || [];
    };

    // Filter items by search query and category
    const getFilteredItems = (): LibraryItem[] => {
        let items = getCurrentItems();

        // Filter by category (only for books)
        if (activeTab === "books" && selectedCategory) {
            items = items.filter(item => item.category === selectedCategory);
        }

        if (!searchQuery.trim()) return items;

        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.author.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            (item.category && item.category.toLowerCase().includes(query))
        );
    };

    const handleDownload = (url: string, title: string) => {
        window.open(url, '_blank');
        toast.success(`کردنەوەی "${title}"`, { duration: 2000 });
    };

    const filteredItems = getFilteredItems();
    const currentTab = contentTabs.find(t => t.id === activeTab)!;
    const categories = getCategories();

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
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 shadow-lg shadow-purple-500/25">
                            <Library className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="font-naskh text-3xl md:text-4xl font-bold text-foreground mb-2">
                            کتێبخانەی ئیسلامی کوردی
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            کتێب، وتار، دەنگ و ڤیدیۆی ئیسلامی بە کوردی - زۆربەی کتێبەکان بۆ دابەزاندن ئامادەن
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl mx-auto mb-6"
                    >
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="گەڕان لە کتێب و وتارەکان..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10 h-12 rounded-xl bg-card/50 border-border/50 text-lg"
                            />
                        </div>
                    </motion.div>

                    {/* Category Filter (only for books) */}
                    {activeTab === "books" && categories.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-wrap justify-center gap-2 mb-6"
                        >
                            <Button
                                variant={selectedCategory === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(null)}
                                className="rounded-full"
                            >
                                هەموو
                            </Button>
                            {categories.map(cat => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(cat)}
                                    className="rounded-full"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </motion.div>
                    )}

                    {/* Content Tabs */}
                    <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as ContentType); setSelectedCategory(null); }} className="w-full">
                        <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-5 h-14 mb-8 bg-card/50 rounded-2xl p-1">
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

                        {/* Books, Articles, Audio, Videos Tabs */}
                        {contentTabs.filter(t => t.id !== "external").map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className="mt-0">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                        <p className="text-muted-foreground">چاوەڕێ بکە...</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                                        <p className="text-muted-foreground mb-4">{error}</p>
                                        <Button onClick={fetchLibraryData} variant="outline" className="gap-2">
                                            <RefreshCw className="w-4 h-4" />
                                            هەوڵی دووبارە
                                        </Button>
                                    </div>
                                ) : filteredItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <tab.icon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                        <p className="text-muted-foreground">هیچ ناوەڕۆکێک نەدۆزرایەوە</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Results count */}
                                        <div className="text-center text-sm text-muted-foreground mb-4">
                                            {filteredItems.length} {tab.kurdishLabel}
                                            {selectedCategory && ` - ${selectedCategory}`}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <AnimatePresence mode="popLayout">
                                                {filteredItems.map((item, index) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ delay: index * 0.03 }}
                                                        onClick={() => setSelectedItem(item)}
                                                        className="group p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center shrink-0 shadow-md`}>
                                                                <currentTab.icon className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-xs text-primary/70 mt-1">
                                                                    {item.author}
                                                                </p>
                                                                {item.description && (
                                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                                        {item.description}
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                    {item.category && (
                                                                        <span className={`inline-block px-2 py-0.5 text-[10px] bg-gradient-to-r ${getCategoryColor(item.category)} text-white rounded-full`}>
                                                                            {item.category}
                                                                        </span>
                                                                    )}
                                                                    {item.pages && (
                                                                        <span className="text-[10px] text-muted-foreground">
                                                                            {item.pages} لاپەڕە
                                                                        </span>
                                                                    )}
                                                                    {item.downloadUrl && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 rounded-full">
                                                                            <Download className="w-3 h-3" />
                                                                            دابەزاندن
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </>
                                )}
                            </TabsContent>
                        ))}

                        {/* External Libraries Tab */}
                        <TabsContent value="external" className="mt-0">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                    <p className="text-muted-foreground">چاوەڕێ بکە...</p>
                                </div>
                            ) : !libraryData?.externalLibraries?.length ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Globe className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground">هیچ کتێبخانەیەک نیە</p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-6">
                                        <p className="text-muted-foreground">
                                            کتێبخانە ئۆنلاینەکانی کوردی کە کتێبی ئیسلامییان تێدایە
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <AnimatePresence mode="popLayout">
                                            {libraryData.externalLibraries.map((lib, index) => (
                                                <motion.a
                                                    key={lib.id}
                                                    href={lib.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="group p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl shrink-0">
                                                            {lib.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                                    {lib.name}
                                                                </h3>
                                                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                            </div>
                                                            <p className="text-xs text-primary/60 mt-0.5">
                                                                {lib.nameEn}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                                {lib.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    </Tabs>

                    {/* Info Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-muted-foreground">
                            📚 کتێبەکانی کە نیشانەی <span className="text-emerald-600">دابەزاندن</span> هەیە دەتوانیت ڕاستەوخۆ بیانبەزێنیت
                        </p>
                    </motion.div>
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
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl p-6 shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(selectedItem.category)} flex items-center justify-center shadow-lg`}>
                                    <currentTab.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-xl text-foreground">{selectedItem.title}</h2>
                                    <p className="text-sm text-primary">{selectedItem.author}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground mb-4 leading-relaxed">{selectedItem.description}</p>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {selectedItem.category && (
                                    <span className={`px-3 py-1 text-sm bg-gradient-to-r ${getCategoryColor(selectedItem.category)} text-white rounded-full`}>
                                        {selectedItem.category}
                                    </span>
                                )}
                                {selectedItem.pages && (
                                    <span className="px-3 py-1 text-sm bg-muted rounded-full text-muted-foreground">
                                        {selectedItem.pages} لاپەڕە
                                    </span>
                                )}
                            </div>

                            {/* Download button or coming soon */}
                            {selectedItem.downloadUrl ? (
                                <Button
                                    onClick={() => handleDownload(selectedItem.downloadUrl!, selectedItem.title)}
                                    className="w-full gap-2 h-12 text-lg rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                                >
                                    <Download className="w-5 h-5" />
                                    دابەزاندن / کردنەوە
                                </Button>
                            ) : (
                                <div className="bg-muted/50 rounded-xl p-4 mb-4 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        🔜 داگرتن بەم زووانە زیاد دەکرێت
                                    </p>
                                </div>
                            )}

                            {/* Close button */}
                            <Button
                                onClick={() => setSelectedItem(null)}
                                variant="outline"
                                className="w-full mt-3 rounded-xl"
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
