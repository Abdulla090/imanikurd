import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Save, Trash2, Eye, EyeOff, Sparkles, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { toast } from "sonner";

// Available Gemini models
const GEMINI_MODELS = [
    {
        id: "gemini-3.1-flash-lite-preview",
        name: "Gemini 3.1 Flash Lite Preview",
        description: "نوێترین و خێراترین - زۆر خێرا و کەم تێچوو",
        icon: Rocket,
        badge: "NEW",
        badgeColor: "bg-purple-500"
    },
    {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash Preview",
        description: "زیرەک و بەهێز - بنەڕەتی پشتگیری",
        icon: Sparkles,
        badge: "FALLBACK",
        badgeColor: "bg-emerald-500"
    },
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        description: "جێگیر و متمانەپێکراو",
        icon: Zap,
        badge: "STABLE",
        badgeColor: "bg-blue-500"
    },
];

export default function SecretKeyPage() {
    const [key, setKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [model, setModel] = useState("gemini-3.1-flash-lite-preview");

    useEffect(() => {
        const savedKey = localStorage.getItem("IMAN_K_DEV_GEMINI_KEY");
        const savedModel = localStorage.getItem("IMAN_K_DEV_GEMINI_MODEL");
        if (savedKey) setKey(savedKey);
        if (savedModel) setModel(savedModel);
    }, []);

    const saveConfig = () => {
        localStorage.setItem("IMAN_K_DEV_GEMINI_KEY", key);
        localStorage.setItem("IMAN_K_DEV_GEMINI_MODEL", model);
        toast.success("ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوت کران");
    };

    const clearConfig = () => {
        localStorage.removeItem("IMAN_K_DEV_GEMINI_KEY");
        localStorage.removeItem("IMAN_K_DEV_GEMINI_MODEL");
        setKey("");
        setModel("gemini-3.1-flash-lite-preview");
        toast.success("ڕێکخستنەکان سڕانەوە");
    };

    const selectedModel = GEMINI_MODELS.find(m => m.id === model) || GEMINI_MODELS[0];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-8 rounded-3xl space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                <Key className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold font-naskh">ڕێکخستنە نهێنییەکان</h1>
                            <p className="text-sm text-muted-foreground">لێرە دەتوانیت کلیل و مۆدێلی ژیری دەستکرد بگۆڕیت</p>
                        </div>

                        <div className="space-y-5">
                            {/* API Key Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium mr-1 italic">Gemini API Key</label>
                                <div className="relative">
                                    <Input
                                        type={showKey ? "text" : "password"}
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="pr-10"
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">ئەگەر بەتاڵ بێت، کلیلی بنەڕەتی بەکاردەهێنرێت</p>
                            </div>

                            {/* Model Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium mr-1 italic">AI Model - مۆدێلی ژیری دەستکرد</label>
                                <div className="space-y-2">
                                    {GEMINI_MODELS.map((m) => {
                                        const Icon = m.icon;
                                        const isSelected = model === m.id;
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => setModel(m.id)}
                                                className={`w-full p-4 rounded-xl border-2 transition-all text-right flex items-center gap-3 ${isSelected
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-medium text-sm">{m.name}</span>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full text-white ${m.badgeColor}`}>
                                                            {m.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground">{m.description}</p>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Current Selection Display */}
                            <div className="bg-muted/50 rounded-xl p-3 text-center">
                                <p className="text-[10px] text-muted-foreground mb-1">مۆدێلی ئێستا:</p>
                                <p className="text-sm font-mono text-primary font-medium">{selectedModel.name}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-col gap-2">
                                <Button onClick={saveConfig} className="w-full gap-2 py-6 rounded-2xl">
                                    <Save className="w-5 h-5" />
                                    پاشەکەوتکردن
                                </Button>
                                <Button onClick={clearConfig} variant="outline" className="w-full gap-2 py-6 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-5 h-5" />
                                    سڕینەوەی هەمووی
                                </Button>
                            </div>
                        </div>

                        <div className="text-[10px] text-center text-muted-foreground pt-4 space-y-1">
                            <p>ئەم پەیجە نهێنییە و هیچ لینکی نییە</p>
                            <p className="font-mono text-primary/60">/iman-secret-config-99</p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
