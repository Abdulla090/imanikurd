import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { cn } from "@/lib/utils";

const TASBIH_OPTIONS = [
    { id: 1, arabic: "سُبْحَانَ اللَّهِ", kurdish: "پاکی بۆ خودایە", target: 33 },
    { id: 2, arabic: "الْحَمْدُ لِلَّهِ", kurdish: "ستایش بۆ خودایە", target: 33 },
    { id: 3, arabic: "اللَّهُ أَكْبَرُ", kurdish: "خودا گەورەترە", target: 34 },
    { id: 4, arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", kurdish: "هیچ پەرستراوێک نیە جگە لە خودا", target: 100 },
    { id: 5, arabic: "أَسْتَغْفِرُ اللَّهَ", kurdish: "داوای لێخۆشبوون لە خودا دەکەم", target: 100 },
    { id: 6, arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", kurdish: "پاکی و ستایش بۆ خودایە", target: 100 },
    { id: 7, arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", kurdish: "هیچ هێز و تواناییەک نیە جگە لە خوداوە", target: 100 },
];

export default function TasbihPage() {
    const [selectedOption, setSelectedOption] = useState(TASBIH_OPTIONS[0]);
    const [count, setCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    // Load saved total from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("tasbih-total");
        if (saved) {
            setTotalCount(parseInt(saved));
        }
    }, []);

    // Save total to localStorage
    useEffect(() => {
        localStorage.setItem("tasbih-total", totalCount.toString());
    }, [totalCount]);

    const handleCount = () => {
        setCount(count + 1);
        setTotalCount(totalCount + 1);

        // Vibrate on milestone
        if (vibrationEnabled && (count + 1) % 33 === 0 && navigator.vibrate) {
            navigator.vibrate(100);
        }
    };

    const resetCount = () => {
        setCount(0);
    };

    const resetTotal = () => {
        setTotalCount(0);
        setCount(0);
    };

    const progress = (count / selectedOption.target) * 100;
    const isComplete = count >= selectedOption.target;

    return (
        <div className="relative min-h-screen overflow-hidden">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 sm:pt-32 pb-24 sm:pb-32 px-2 sm:px-4 md:px-6">
                <div className="w-full max-w-md mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="font-naskh text-3xl font-bold text-foreground mb-2">
                            تەسبیح
                        </h1>
                        <p className="text-muted-foreground">
                            ژمێرەرەوەی دیجیتاڵی تەسبیح
                        </p>
                    </motion.div>

                    {/* Responsive Zikr Selection */}
                    <div className="flex lg:grid lg:grid-cols-1 overflow-x-auto lg:overflow-x-visible gap-2 mb-6 lg:mb-0 lg:fixed lg:right-8 lg:top-32 lg:w-64 pb-2 lg:pb-0 scrollbar-none snap-x">
                        {TASBIH_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    setSelectedOption(option);
                                    setCount(0);
                                }}
                                className={cn(
                                    "px-4 py-2 lg:p-4 rounded-xl lg:rounded-2xl text-center lg:text-right transition-all whitespace-nowrap lg:whitespace-normal snap-center flex flex-col gap-0.5 min-w-[120px] lg:min-w-0 border border-transparent",
                                    selectedOption.id === option.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary/20"
                                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:border-border"
                                )}
                            >
                                <span className="font-arabic text-sm lg:text-base font-bold">{option.arabic}</span>
                                <span className="text-[10px] lg:text-xs opacity-75">ئامانج: {option.target}</span>
                            </button>
                        ))}
                    </div>

                    <div className="lg:pr-0 lg:max-w-2xl lg:mx-auto">
                        {/* Main Counter */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card text-center mb-6 p-6 lg:p-12 shadow-2xl shadow-primary/5"
                        >
                            {/* Current Zikr */}
                            <div className="mb-6 lg:mb-10">
                                <p className="font-arabic text-2xl lg:text-4xl text-foreground mb-2 lg:mb-4 leading-relaxed">
                                    {selectedOption.arabic}
                                </p>
                                <p className="text-xs lg:text-lg text-muted-foreground max-w-sm mx-auto">
                                    {selectedOption.kurdish}
                                </p>
                            </div>

                            {/* Counter Button */}
                            <div className="relative inline-block mb-6 lg:mb-10">
                                <svg className="w-40 h-40 lg:w-64 lg:h-64" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-muted/20"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="text-primary transition-all duration-300"
                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - Math.min(progress, 100) / 100)}`}
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <button
                                    onClick={handleCount}
                                    className={cn(
                                        "absolute inset-0 m-auto w-32 h-32 lg:w-52 lg:h-52 rounded-full flex flex-col items-center justify-center transition-all active:scale-90 shadow-2xl",
                                        isComplete
                                            ? "bg-emerald-500 text-white"
                                            : "bg-primary text-primary-foreground hover:brightness-110"
                                    )}
                                >
                                    <AnimatePresence mode="wait">
                                        {isComplete ? (
                                            <motion.div key="complete" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                                                <Check className="w-12 h-12 lg:w-20 lg:h-20" />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="counting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                                                <span className="text-4xl lg:text-7xl font-bold font-mono tracking-tighter">{count}</span>
                                                <div className="w-8 lg:w-16 h-px bg-current/20 my-1 lg:my-3" />
                                                <span className="text-[10px] lg:text-lg opacity-75 font-medium">{selectedOption.target}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 lg:gap-8">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={resetCount}
                                    className="gap-2 text-xs lg:text-sm text-muted-foreground hover:text-primary rounded-xl lg:px-6"
                                >
                                    <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
                                    ڕیسێت
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setVibrationEnabled(!vibrationEnabled)}
                                        className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-xl", vibrationEnabled ? "text-primary bg-primary/10" : "text-muted-foreground")}
                                    >
                                        {vibrationEnabled ? <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" /> : <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" />}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Total Stats - Compact Row */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-2xl lg:rounded-3xl p-4 lg:p-8 flex items-center justify-between"
                        >
                            <div className="text-right">
                                <div className="text-[10px] lg:text-sm text-muted-foreground mb-1">کۆی گشتی هەمووی</div>
                                <div className="text-2xl lg:text-4xl font-bold text-primary tabular-nums">
                                    {totalCount.toLocaleString()}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetTotal}
                                className="text-[10px] lg:text-xs text-muted-foreground hover:text-destructive h-8 lg:h-10 px-4"
                            >
                                سڕینەوەی هەموو داتاکان
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
