import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Search, ArrowRight, Grid, Book, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types matching our JSON structure
interface DhikrItem {
    id: number;
    categoryId: number;
    arabic: string;
    kurdish: string;
    count: number;
}

interface DhikrCategory {
    id: number;
    name: string;
}

interface DhikrData {
    categories: DhikrCategory[];
    items: DhikrItem[];
}

export default function AzkarPage() {
    const [data, setData] = useState<DhikrData | null>(null);
    const [loading, setLoading] = useState(true);

    // Navigation State
    const [selectedCategory, setSelectedCategory] = useState<DhikrCategory | null>(null);
    const [sessionItems, setSessionItems] = useState<DhikrItem[]>([]);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // Counter Session State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [counter, setCounter] = useState(0);
    const [completedIds, setCompletedIds] = useState<number[]>([]);

    // Load Data
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/data/dhikr_kurdish.json');
                if (!response.ok) throw new Error("Failed to load data");
                const json: DhikrData = await response.json();
                setData(json);
            } catch (err) {
                console.error(err);
                toast.error("هەڵە لە بارکردنی زیکرەکان");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Filter Categories
    const filteredCategories = data?.categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Start Session
    const startSession = (category: DhikrCategory) => {
        if (!data) return;
        const items = data.items.filter(i => i.categoryId === category.id);
        if (items.length === 0) {
            toast.error("هیچ زیکرێک لەم بەشەدا نییە");
            return;
        }
        setSessionItems(items);
        setSelectedCategory(category);
        setCurrentIndex(0);
        setCounter(0);
        setCompletedIds([]);
    };

    const closeSession = () => {
        setSelectedCategory(null);
        setSessionItems([]);
    };

    // Counter Logic
    const currentItem = sessionItems[currentIndex];
    // Default count to 1 if missing or 0
    const targetCount = currentItem?.count || 1;
    // Calculate progress for current item
    const itemProgress = counter / targetCount;
    // Calculate total session progress
    const totalProgress = ((currentIndex + itemProgress) / sessionItems.length) * 100;

    const handleTap = () => {
        if (counter < targetCount) {
            const newCount = counter + 1;
            setCounter(newCount);

            if (newCount === targetCount) {
                // Just finished this item
                if (!completedIds.includes(currentItem.id)) {
                    setCompletedIds(prev => [...prev, currentItem.id]);
                }

                // Auto advance after small delay if not last
                if (currentIndex < sessionItems.length - 1) {
                    setTimeout(() => {
                        setCurrentIndex(prev => prev + 1);
                        setCounter(0);
                    }, 200); // Small delay for satisfaction
                } else {
                    toast.success("پیرۆزە! هەموو زیکرەکانت خوێند");
                }
            }
        }
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCounter(0);
    };

    const prevItem = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setCounter(0);
        }
    };

    const nextItem = () => {
        if (currentIndex < sessionItems.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setCounter(0);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 sm:pt-32 pb-16 px-4">
                {/* VIEW: CATEGORY LIST */}
                {!selectedCategory && (
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h1 className="font-naskh text-4xl font-bold mb-4">ئەزکار و ویردەکانی رۆژانە</h1>
                            <p className="text-muted-foreground">زیاتر لە ١٢٠ پۆلی جیاواز لە زیکر و دوعا</p>
                        </motion.div>

                        <div className="relative mb-8 max-w-lg mx-auto">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="گەڕان لە بەشەکان..."
                                className="pr-10 h-12 text-lg"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-20">جارکردن...</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-20">
                                {filteredCategories.map((cat, i) => (
                                    <motion.button
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        onClick={() => startSession(cat)}
                                        className="flex items-center gap-4 p-4 text-right bg-card/50 hover:bg-card border border-border/50 rounded-2xl transition-all shadow-sm hover:shadow-md group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Book className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground/90 line-clamp-1">{cat.name}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {data?.items.filter(item => item.categoryId === cat.id).length || 0} زیکر
                                            </p>
                                        </div>
                                    </motion.button>
                                ))}

                                {filteredCategories.length === 0 && (
                                    <div className="col-span-full text-center py-10 text-muted-foreground">
                                        هیچ ئەنجامێک نەدۆزرایەوە
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* VIEW: ACTIVE SESSION */}
                {selectedCategory && currentItem && (
                    <div className="max-w-2xl mx-auto min-h-[80vh] flex flex-col">
                        {/* Header / Nav */}
                        <div className="flex items-center justify-between mb-8">
                            <Button variant="ghost" className="gap-2" onClick={closeSession}>
                                <ArrowRight className="w-4 h-4" />
                                گەڕانەوە
                            </Button>
                            <div className="text-center">
                                <h2 className="font-bold text-lg">{selectedCategory.name}</h2>
                                <p className="text-xs text-muted-foreground">
                                    {currentIndex + 1} لە {sessionItems.length}
                                </p>
                            </div>
                            <div className="w-20" /> {/* Spacer */}
                        </div>

                        {/* Main Card */}
                        <div className="flex-1 flex flex-col">
                            <motion.div
                                key={currentItem.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex-1 glass-card rounded-3xl p-6 sm:p-10 flex flex-col relative overflow-hidden shadow-2xl"
                            >
                                {/* Progress Line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/10">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${totalProgress}%` }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-8">
                                    <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-foreground">
                                        {currentItem.arabic}
                                    </p>

                                    {currentItem.kurdish && (
                                        <div className="bg-muted/30 px-6 py-4 rounded-2xl border border-white/5">
                                            <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed">
                                                {currentItem.kurdish}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Interaction Zone */}
                                <div className="mt-auto pt-8 flex flex-col items-center gap-6">
                                    {/* Main Button */}
                                    <button
                                        onClick={handleTap}
                                        className={cn(
                                            "w-24 h-24 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-xl touch-manipulation select-none active:scale-95",
                                            counter >= targetCount
                                                ? "bg-emerald-500 text-white cursor-default"
                                                : "bg-primary text-primary-foreground hover:brightness-110 active:brightness-90 cursor-pointer"
                                        )}
                                    >
                                        {counter >= targetCount ? (
                                            <div className="scale-125">✓</div>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold font-mono">{targetCount - counter}</span>
                                                <span className="text-[10px] opacity-75 uppercase tracking-wider">ماوە</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Controls */}
                                    <div className="flex items-center gap-8 text-muted-foreground w-full justify-center">
                                        <Button variant="ghost" size="icon" onClick={prevItem} disabled={currentIndex === 0}>
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                                            onClick={handleReset}
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={nextItem}
                                            disabled={currentIndex === sessionItems.length - 1}
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>

                            </motion.div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
