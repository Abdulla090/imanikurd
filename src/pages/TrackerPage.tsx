import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";

interface Action {
  id: string;
  name: string;
  type: "good" | "bad";
  count: number;
  date: string;
}

const defaultGoodDeeds = [
  "نوێژ لەسەر کات",
  "خوێندنەوەی قورئان",
  "یارمەتی هەژاران",
  "زیکر",
  "سەدەقە",
];

const defaultBadDeeds = [
  "دەروانی حەرام",
  "قسەی خراپ",
  "غیبەت",
  "درۆ",
];

export default function TrackerPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [newGoodDeed, setNewGoodDeed] = useState("");
  const [newBadDeed, setNewBadDeed] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("iman-tracker");
    if (stored) {
      setActions(JSON.parse(stored));
    } else {
      const today = new Date().toISOString().split("T")[0];
      const initial: Action[] = [
        ...defaultGoodDeeds.map((name, i) => ({
          id: `good-${i}`,
          name,
          type: "good" as const,
          count: 0,
          date: today,
        })),
        ...defaultBadDeeds.map((name, i) => ({
          id: `bad-${i}`,
          name,
          type: "bad" as const,
          count: 0,
          date: today,
        })),
      ];
      setActions(initial);
    }
  }, []);

  useEffect(() => {
    if (actions.length > 0) {
      localStorage.setItem("iman-tracker", JSON.stringify(actions));
    }
  }, [actions]);

  const updateCount = (id: string, delta: number) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, count: Math.max(0, a.count + delta) } : a
      )
    );
  };

  const addAction = (type: "good" | "bad") => {
    const name = type === "good" ? newGoodDeed : newBadDeed;
    if (!name.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    setActions((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}`,
        name: name.trim(),
        type,
        count: 0,
        date: today,
      },
    ]);

    if (type === "good") setNewGoodDeed("");
    else setNewBadDeed("");
  };

  const removeAction = (id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

  const goodDeeds = actions.filter((a) => a.type === "good");
  const badDeeds = actions.filter((a) => a.type === "bad");
  const totalGood = goodDeeds.reduce((sum, a) => sum + a.count, 0);
  const totalBad = badDeeds.reduce((sum, a) => sum + a.count, 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GeometricPattern />
      <Navigation />

      <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-2 sm:px-4 md:px-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-naskh text-3xl md:text-4xl font-bold text-foreground mb-2">
              شوێنکەوتنی کردار
            </h1>
            <p className="text-muted-foreground">
              تۆمارکردنی کارە چاکەکان و گوناهەکان
            </p>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8"
          >
            <div className="feature-card text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">کارە چاکەکان</span>
              </div>
              <p className="font-arabic text-3xl font-bold text-primary">{totalGood}</p>
            </div>
            <div className="feature-card text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-destructive" />
                <span className="text-sm text-muted-foreground">گوناهەکان</span>
              </div>
              <p className="font-arabic text-3xl font-bold text-destructive">{totalBad}</p>
            </div>
          </motion.div>

          <div className="space-y-12">
            {/* Good Deeds Grid */}
            <section>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-naskh text-2xl font-bold">کارە چاکەکان</h2>
                  <p className="text-xs text-muted-foreground">کلیک بکە بۆ زیادکردنی پاداشتەکانت</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {goodDeeds.map((deed) => (
                  <motion.div
                    key={deed.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => updateCount(deed.id, 1)}
                      className="w-full h-full glass-card p-5 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 hover:border-primary/50 transition-all text-center min-h-[140px] sm:min-h-[160px]"
                    >
                      <span className="text-sm font-bold text-foreground/80 line-clamp-2">{deed.name}</span>
                      <span className="text-3xl sm:text-4xl font-bold text-primary font-mono tracking-tighter">
                        {deed.count}
                      </span>
                    </button>

                    {/* Action Overlay */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCount(deed.id, -1);
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAction(deed.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

                {/* Add New Good Deed Tile */}
                <div className="glass-card p-4 border-dashed border-primary/20 flex flex-col gap-3 min-h-[160px] justify-center">
                  <Input
                    placeholder="ناونیشانی نوێ..."
                    value={newGoodDeed}
                    onChange={(e) => setNewGoodDeed(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addAction("good")}
                    className="h-10 text-xs bg-muted/20"
                  />
                  <Button onClick={() => addAction("good")} className="w-full h-10 gap-2">
                    <Plus className="w-4 h-4" />
                    زیادکردن
                  </Button>
                </div>
              </div>
            </section>

            {/* Bad Deeds Grid */}
            <section>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h2 className="font-naskh text-2xl font-bold text-destructive">گوناهەکان</h2>
                  <p className="text-xs text-muted-foreground">هەوڵ بدە ئەم خانانە بە سفری بمێننەوە</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {badDeeds.map((deed) => (
                  <motion.div
                    key={deed.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => updateCount(deed.id, 1)}
                      className="w-full h-full glass-card p-5 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 hover:border-destructive/50 transition-all text-center min-h-[140px] sm:min-h-[160px]"
                    >
                      <span className="text-sm font-bold text-foreground/80 line-clamp-2">{deed.name}</span>
                      <span className="text-3xl sm:text-4xl font-bold text-destructive font-mono tracking-tighter">
                        {deed.count}
                      </span>
                    </button>

                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCount(deed.id, -1);
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAction(deed.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

                <div className="glass-card p-4 border-dashed border-destructive/20 flex flex-col gap-3 min-h-[160px] justify-center">
                  <Input
                    placeholder="ناونیشانی نوێ..."
                    value={newBadDeed}
                    onChange={(e) => setNewBadDeed(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addAction("bad")}
                    className="h-10 text-xs bg-muted/20"
                  />
                  <Button variant="destructive" onClick={() => addAction("bad")} className="w-full h-10 gap-2">
                    <Plus className="w-4 h-4" />
                    زیادکردن
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
