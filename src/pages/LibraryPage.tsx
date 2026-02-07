import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, FileText, Headphones, Video, Search, ChevronLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface LibraryItem {
    id: number;
    title: string;
    author: string;
    description: string;
    category?: string;
}

interface LibraryData {
    books: LibraryItem[];
    articles: LibraryItem[];
    audio: LibraryItem[];
    videos: LibraryItem[];
}

type ContentType = "books" | "articles" | "audio" | "videos";

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
];

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<ContentType>("books");
    const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

    // Fetch library data on mount
    useEffect(() => {
        fetchLibraryData();
    }, []);

    const fetchLibraryData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/data/library.json");
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

    // Get items for current tab
    const getCurrentItems = (): LibraryItem[] => {
        if (!libraryData) return [];
        return libraryData[activeTab] || [];
    };

    // Filter items by search query
    const getFilteredItems = (): LibraryItem[] => {
        const items = getCurrentItems();
        if (!searchQuery.trim()) return items;

        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.author.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
    };

    const filteredItems = getFilteredItems();
    const currentTab = contentTabs.find(t => t.id === activeTab)!;

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
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
                            <Book className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="font-naskh text-3xl md:text-4xl font-bold text-foreground mb-2">
                            کتێبخانەی ئیسلامی
                        </h1>
                        <p className="text-muted-foreground">
                            کتێب، وتار، دەنگ و ڤیدیۆی ئیسلامی بە کوردی
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl mx-auto mb-8"
                    >
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="گەڕان..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10 h-12 rounded-xl bg-card/50 border-border/50"
                            />
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <AnimatePresence mode="popLayout">
                                            {filteredItems.map((item, index) => (
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
                                                            <currentTab.icon className="w-6 h-6 text-primary" />
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
                                                            {item.category && (
                                                                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>

                    {/* Coming Soon Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-muted-foreground">
                            🚧 ناوەڕۆکی زیاتر بەردەوام زیاد دەکرێت...
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
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <currentTab.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-xl text-foreground">{selectedItem.title}</h2>
                                    <p className="text-sm text-primary">{selectedItem.author}</p>
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-4">{selectedItem.description}</p>

                            {selectedItem.category && (
                                <div className="mb-4">
                                    <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                                        {selectedItem.category}
                                    </span>
                                </div>
                            )}

                            <div className="bg-muted/50 rounded-xl p-4 mb-4">
                                <p className="text-sm text-muted-foreground text-center">
                                    🔜 داگرتن و خوێندنەوەی ئۆنلاین بەم زووانە زیاد دەکرێت
                                </p>
                            </div>

                            <Button
                                onClick={() => setSelectedItem(null)}
                                className="w-full"
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
