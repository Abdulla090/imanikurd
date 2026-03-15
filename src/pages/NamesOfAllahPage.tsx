import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { cn } from "@/lib/utils";

interface NameOfAllah {
    id: number;
    arabic: string;
    kurdish: string;
    english: string;
}

export default function NamesOfAllahPage() {
    const [names, setNames] = useState<NameOfAllah[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/names_of_allah.json`)
            .then(res => res.json())
            .then(data => {
                setNames(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredNames = names.filter(n =>
        n.arabic.includes(searchQuery) ||
        n.kurdish.includes(searchQuery) ||
        n.english.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <h1 className="font-naskh text-4xl md:text-5xl font-bold text-foreground mb-4">
                            ناوە پیرۆزەکانی خودا
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            ٩٩ ناوی پیرۆزی پەروەردگار کە هەڵگری سیفات و گەورەیی ئەون
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
                            placeholder="گەڕان لە ناوەکان..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pr-10 h-12 text-lg glass-card border-primary/20"
                        />
                    </motion.div>

                    {/* Grid */}
                    {loading ? (
                        <div className="text-center py-20">جارکردن...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNames.map((name, index) => (
                                <motion.div
                                    key={name.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border border-primary/10 hover:border-primary/30"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-colors group-hover:bg-primary/10" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <span className="text-xs font-mono text-primary/60 mb-2 border border-primary/20 px-2 py-0.5 rounded-full">
                                            #{name.id}
                                        </span>

                                        <h2 className="font-arabic text-4xl md:text-5xl text-primary mb-4 drop-shadow-sm">
                                            {name.arabic}
                                        </h2>

                                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4" />

                                        <h3 className="font-bold text-lg text-foreground mb-1">
                                            {name.kurdish}
                                        </h3>

                                        <p className="text-sm text-muted-foreground font-medium">
                                            {name.english}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
