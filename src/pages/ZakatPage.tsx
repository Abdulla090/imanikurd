import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Coins, Landmark, HelpCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { toast } from "sonner";

export default function ZakatPage() {
    const [cash, setCash] = useState<number>(0);
    const [goldValue, setGoldValue] = useState<number>(0);
    const [silverValue, setSilverValue] = useState<number>(0);
    const [businessAssets, setBusinessAssets] = useState<number>(0);
    const [debts, setDebts] = useState<number>(0);

    const NISAB_GOLD = 85; // 85 grams of gold
    const GOLD_PRICE_GRAM = 85000; // Estimated IQD per gram, should ideally be dynamic
    const currentNisab = NISAB_GOLD * GOLD_PRICE_GRAM;

    const totalWealth = (cash + goldValue + silverValue + businessAssets) - debts;
    const zakatAmount = totalWealth >= currentNisab ? totalWealth * 0.025 : 0;

    const handleCalculate = () => {
        if (totalWealth < currentNisab) {
            toast.info("سەرمایەکەت نەگەیشتووەتە ڕادەی نیساب", {
                description: `نیسابی ساڵانە نزیکەی ${currentNisab.toLocaleString()} دینارە`
            });
        } else {
            toast.success("ئەژمارکردن کۆتایی هات", {
                description: `بڕی زەکاتی سەر پێت: ${zakatAmount.toLocaleString()} دینار`
            });
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-4">
                <div className="w-full max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                            <Calculator className="w-8 h-8 text-amber-600" />
                        </div>
                        <h1 className="font-naskh text-3xl md:text-4xl font-bold text-foreground mb-2">
                            ژمێرەری زەکات
                        </h1>
                        <p className="text-muted-foreground">
                            بڕی زەکاتی سەر ماڵ و سامانت ئەژمار بکە بە وردی
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 sm:p-8 space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Coins className="w-4 h-4 text-primary" />
                                        پارەی نەختینە (دینار)
                                    </label>
                                    <Input
                                        type="number"
                                        value={cash}
                                        onChange={(e) => setCash(Number(e.target.value))}
                                        placeholder="بڕی پارەکەت بنووسە"
                                        className="bg-muted/50 border-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Landmark className="w-4 h-4 text-amber-600" />
                                        بەهای زێڕ و زیو
                                    </label>
                                    <Input
                                        type="number"
                                        value={goldValue}
                                        onChange={(e) => setGoldValue(Number(e.target.value))}
                                        placeholder="بەهای زێڕەکانی بنووسە"
                                        className="bg-muted/50 border-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                                        سامانی بازرگانی (کەلوپەل)
                                    </label>
                                    <Input
                                        type="number"
                                        value={businessAssets}
                                        onChange={(e) => setBusinessAssets(Number(e.target.value))}
                                        placeholder="بەهای کەلوپەلی بازرگانی"
                                        className="bg-muted/50 border-primary/20"
                                    />
                                </div>

                                <div className="space-y-2 text-destructive">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-destructive" />
                                        قەرزەکان (ئەوانەی دەیدەیتەوە)
                                    </label>
                                    <Input
                                        type="number"
                                        value={debts}
                                        onChange={(e) => setDebts(Number(e.target.value))}
                                        placeholder="بڕی ئەو قەرزانەی لەسەرتە"
                                        className="bg-muted/50 border-destructive/20 focus:ring-destructive"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full py-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                ئەژمارکردنی زەکات
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="feature-card p-8 text-center bg-primary/5 border-primary/20">
                                <p className="text-sm text-muted-foreground mb-2">کۆی گشتی سەرمایە</p>
                                <p className="font-arabic text-4xl font-bold text-primary mb-6">
                                    {totalWealth.toLocaleString()} <span className="text-lg">دینار</span>
                                </p>

                                <div className="h-px bg-border my-6" />

                                <p className="text-sm text-muted-foreground mb-2">بڕی زەکاتی پێویست (٢.٥٪)</p>
                                <p className={`font-arabic text-5xl font-bold mb-4 ${zakatAmount > 0 ? "text-emerald-600" : "text-muted-foreground/50"}`}>
                                    {zakatAmount.toLocaleString()} <span className="text-xl">دینار</span>
                                </p>

                                {zakatAmount > 0 && (
                                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-medium animate-pulse">
                                        پیرۆزە! تۆ گەیشتوویتە ڕادەی پێویست بۆ زەکات
                                    </div>
                                )}
                            </div>

                            <div className="glass-card p-6 space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    زانیاری دەربارەی نیساب
                                </h3>
                                <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                                    <p>• نیساب بریتییە لە بڕی ٨٥ گرام زێڕ یان ٥٩٥ گرام زیو.</p>
                                    <p>• ئەگەر سەرمایەکەت ساڵێکی بەسەردا تێپەڕ بوو و گەیشتە نیساب، زەکاتت لەسەر واجبە.</p>
                                    <p>• بڕی زەکات بریتییە لە ٢.٥٪ (یەک لە چل)ی هەموو سەرمایەکەت.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
