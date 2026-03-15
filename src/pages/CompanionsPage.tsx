import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, X, ChevronLeft, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { Button } from "@/components/ui/button";

interface Companion {
    id: number;
    name: string;
    description: string;
}

const CompanionModal = memo(({
    companion,
    onClose
}: {
    companion: Companion | null;
    onClose: () => void
}) => {
    if (!companion) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-background rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-border"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20 rounded-t-3xl">
                        <h2 className="text-2xl font-bold font-naskh text-primary pr-2 border-r-4 border-primary/50">
                            {companion.name}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="whitespace-pre-wrap leading-loose text-foreground/90 font-naskh text-lg text-justify">
                                {companion.description}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border/50 bg-muted/10 rounded-b-3xl flex justify-end">
                        <Button onClick={onClose}>
                            داخستن
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});
CompanionModal.displayName = 'CompanionModal';

export default function CompanionsPage() {
    const [companions, setCompanions] = useState<Companion[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/companions.json`)
            .then(res => res.json())
            .then(data => {
                setCompanions(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const filtered = companions.filter(c =>
        c.name.includes(searchQuery) ||
        c.description.includes(searchQuery)
    );

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-6">
                            <Users className="w-8 h-8" />
                        </div>
                        <h1 className="font-naskh text-4xl md:text-5xl font-bold text-foreground mb-4">
                            هاوەڵانی پێغەمبەر
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            ژیاننامەی هاوەڵە بەڕێزەکانی پێغەمبەری خوا (صلى الله عليه وسلم)
                        </p>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-md mx-auto mb-12 relative"
                    >
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="گەڕان لە ناو هاوەڵان..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pr-10 h-12 text-lg glass-card border-primary/20"
                        />
                    </motion.div>

                    {/* Grid */}
                    {loading ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground">بارکردنی زانیاریەکان...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((companion, index) => (
                                <motion.div
                                    key={companion.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedCompanion(companion)}
                                    className="glass-card p-6 rounded-2xl cursor-pointer group hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                            <span className="font-bold font-mono text-sm">{index + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg font-naskh line-clamp-1">{companion.name}</h3>
                                            <p className="text-xs text-muted-foreground">کرتە بکە بۆ خوێندنەوە</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-70">
                                        {companion.description}
                                    </p>

                                    <div className="mt-4 flex justify-end">
                                        <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:underline">
                                            زیاتر بخوێنەوە
                                            <ChevronLeft className="w-3 h-3" />
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {selectedCompanion && (
                <CompanionModal
                    companion={selectedCompanion}
                    onClose={() => setSelectedCompanion(null)}
                />
            )}
        </div>
    );
}
