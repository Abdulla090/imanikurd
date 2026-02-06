import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Users, Info, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MiratPage() {
    const [totalEstate, setTotalEstate] = useState<number>(0);
    const [gender, setGender] = useState<"male" | "female">("male");
    const [hasSpouse, setHasSpouse] = useState<boolean>(false);
    const [sons, setSons] = useState<number>(0);
    const [daughters, setDaughters] = useState<number>(0);
    const [hasFather, setHasFather] = useState<boolean>(false);
    const [hasMother, setHasMother] = useState<boolean>(false);

    const [results, setResults] = useState<{ name: string; share: string; amount: number }[]>([]);

    const calculateInheritance = () => {
        if (totalEstate <= 0) {
            alert("تکایە بڕی میرات دیاری بکە");
            return;
        }

        let shares: { name: string; share: string; amount: number }[] = [];
        let totalShares = 0;
        let fixedShares = 0;

        // Calculate fixed shares (Fard shares) first

        // 1. Spouse's share
        if (hasSpouse) {
            if (gender === "male") {
                // Wife's share
                const wifeShare = (sons + daughters > 0) ? 1 / 8 : 1 / 4;
                const wifeAmount = totalEstate * wifeShare;
                shares.push({
                    name: "هاوسەر (ژن)",
                    share: (sons + daughters > 0) ? "1/8" : "1/4",
                    amount: wifeAmount
                });
                fixedShares += wifeAmount;
            } else {
                // Husband's share  
                const husbandShare = (sons + daughters > 0) ? 1 / 4 : 1 / 2;
                const husbandAmount = totalEstate * husbandShare;
                shares.push({
                    name: "هاوسەر (پیاو)",
                    share: (sons + daughters > 0) ? "1/4" : "1/2",
                    amount: husbandAmount
                });
                fixedShares += husbandAmount;
            }
        }

        // 2. Father's share
        if (hasFather) {
            if (sons > 0) {
                // Father gets 1/6 when there are sons
                const fatherAmount = totalEstate * (1 / 6);
                shares.push({ name: "باوک", share: "1/6", amount: fatherAmount });
                fixedShares += fatherAmount;
            } else if (daughters > 0) {
                // Father gets 1/6 + residuary when there are only daughters
                const fatherAmount = totalEstate * (1 / 6);
                shares.push({ name: "باوک", share: "1/6 + ماوە", amount: fatherAmount });
                fixedShares += fatherAmount;
            }
            // If no children, father gets residuary (calculated later)
        }

        // 3. Mother's share
        if (hasMother) {
            let motherShare: number;
            let motherShareText: string;

            if (sons + daughters > 0 || (hasFather && (sons + daughters === 0))) {
                // 1/6 if there are children OR if both parents exist with no children
                motherShare = 1 / 6;
                motherShareText = "1/6";
            } else {
                // 1/3 otherwise
                motherShare = 1 / 3;
                motherShareText = "1/3";
            }

            const motherAmount = totalEstate * motherShare;
            shares.push({ name: "دایک", share: motherShareText, amount: motherAmount });
            fixedShares += motherAmount;
        }

        // 4. Daughters' fixed share (if no sons)
        if (daughters > 0 && sons === 0) {
            let daughterShare: number;
            let daughterShareText: string;

            if (daughters === 1) {
                daughterShare = 1 / 2;
                daughterShareText = "1/2";
            } else {
                daughterShare = 2 / 3;
                daughterShareText = "2/3";
            }

            const totalDaughterAmount = totalEstate * daughterShare;
            const perDaughterAmount = totalDaughterAmount / daughters;

            shares.push({
                name: `کچ (${daughters} کەس)`,
                share: daughterShareText + " (تێکەڵ)",
                amount: totalDaughterAmount
            });
            fixedShares += totalDaughterAmount;
        }

        // Calculate remaining (Asaba - residuary)
        let remaining = totalEstate - fixedShares;

        // 5. Distribute residuary
        if (sons > 0 || daughters > 0) {
            if (sons > 0) {
                // Sons and daughters share residuary in 2:1 ratio
                const totalUnits = (sons * 2) + daughters;
                const unitValue = remaining / totalUnits;

                if (sons > 0) {
                    const sonsAmount = unitValue * 2 * sons;
                    shares.push({
                        name: `کوڕ (${sons} کەس)`,
                        share: "2 پشک بۆ هەر کەسێک",
                        amount: sonsAmount
                    });
                }

                if (daughters > 0) {
                    const daughtersAmount = unitValue * daughters;
                    shares.push({
                        name: `کچ (${daughters} کەس)`,
                        share: "1 پشک بۆ هەر کەسێک",
                        amount: daughtersAmount
                    });
                }
                remaining = 0;
            } else if (daughters > 0) {
                // Only daughters - father gets residuary if present
                if (hasFather && remaining > 0) {
                    const existingFatherShare = shares.find(s => s.name === "باوک");
                    if (existingFatherShare) {
                        existingFatherShare.amount += remaining;
                        existingFatherShare.share = "1/6 + باقی (عەسەبە)";
                    }
                    remaining = 0;
                }
            }
        } else {
            // No children - father gets residuary
            if (hasFather && remaining > 0) {
                shares.push({
                    name: "باوک (عەسەبە)",
                    share: "ماوەکە",
                    amount: remaining
                });
                remaining = 0;
            }
        }

        // Handle any remaining amount (Radd - return to heirs proportionally)
        if (remaining > 0.01) {
            shares.push({
                name: "بێتوخم / بۆ بەیتولماڵ",
                share: "ماوەکە",
                amount: remaining
            });
        }

        setResults(shares);
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-4">
                <div className="w-full max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
                            <Scale className="w-8 h-8 text-teal-600" />
                        </div>
                        <h1 className="font-naskh text-3xl md:text-4xl font-bold text-foreground mb-2">
                            دابەشکردنی میرات
                        </h1>
                        <p className="text-muted-foreground">
                            ئەژمارکردنی بەشی میراتگرەکان بەپێی شەریعەتی ئیسلام
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 glass-card p-6 sm:p-8 space-y-8"
                        >
                            {/* Estate Amount */}
                            <div className="space-y-4">
                                <label className="text-lg font-bold flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-primary" />
                                    کۆی گشتی میرات (دینار)
                                </label>
                                <Input
                                    type="number"
                                    value={totalEstate || ''}
                                    onChange={(e) => setTotalEstate(Number(e.target.value))}
                                    placeholder="بڕی پارە یان بەهای زەمین و شتەکان"
                                    className="bg-muted/50 h-14 text-xl"
                                />
                            </div>

                            {/* Deceased Info */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">ڕەگەزی کۆچکردوو</label>
                                    <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                                        <SelectTrigger className="bg-muted/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">نێر (پیاو)</SelectItem>
                                            <SelectItem value="female">مێ (ژن)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-4 h-full pt-6">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="spouse"
                                            checked={hasSpouse}
                                            onChange={(e) => setHasSpouse(e.target.checked)}
                                            className="w-5 h-5 rounded"
                                        />
                                        <label htmlFor="spouse">
                                            {gender === "male" ? "ژنی هەیە؟" : "مێردی هەیە؟"}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Parents */}
                            <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="father"
                                        checked={hasFather}
                                        onChange={(e) => setHasFather(e.target.checked)}
                                        className="w-5 h-5 rounded"
                                    />
                                    <label htmlFor="father" className="font-medium">باوکی لە ژیانە؟</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="mother"
                                        checked={hasMother}
                                        onChange={(e) => setHasMother(e.target.checked)}
                                        className="w-5 h-5 rounded"
                                    />
                                    <label htmlFor="mother" className="font-medium">دایکی لە ژیانە؟</label>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        ژمارەی کوڕەکان
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={sons || ''}
                                        onChange={(e) => setSons(Number(e.target.value))}
                                        className="bg-muted/50"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        ژمارەی کچەکان
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={daughters || ''}
                                        onChange={(e) => setDaughters(Number(e.target.value))}
                                        className="bg-muted/50"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={calculateInheritance}
                                className="w-full py-7 rounded-2xl bg-teal-600 hover:bg-teal-700 text-lg font-bold"
                            >
                                ئەژمارکردنی دابەشکاری
                            </Button>
                        </motion.div>

                        {/* Results */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="feature-card p-6 bg-primary/5 sticky top-32">
                                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                    <Scale className="w-6 h-6 text-teal-600" />
                                    ئەنجامی دابەشکاری
                                </h3>

                                {results.length > 0 ? (
                                    <div className="space-y-4">
                                        {results.map((res, i) => (
                                            <div key={i} className="flex flex-col p-4 rounded-xl bg-background border border-border shadow-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-foreground">{res.name}</span>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono">
                                                        {res.share}
                                                    </span>
                                                </div>
                                                <div className="text-xl font-arabic font-bold text-teal-600">
                                                    {res.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-sm">دینار</span>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-4 border-t border-border">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold">کۆی گشتی:</span>
                                                <span className="font-arabic text-lg font-bold text-primary">
                                                    {totalEstate.toLocaleString('en-US')} دینار
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground italic flex flex-col items-center gap-4">
                                        <Scale className="w-12 h-12 opacity-20" />
                                        هیچ ئەنجامێک نییە، زانیارییەکان پـڕ بکەرەوە
                                    </div>
                                )}

                                <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <div className="flex gap-3">
                                        <Info className="w-5 h-5 text-amber-600 shrink-0" />
                                        <p className="text-[11px] text-amber-800 leading-relaxed">
                                            <strong>ئاگاداری:</strong> ئەم ئەژمارکردنە تەنها بۆ حاڵەتە باوەکانە (دایک، باوک، هاوسەر، منداڵەکان). بۆ میراتی ئاڵۆزتر (برا، خوشک، کاک، پوور، هتد) تکایە ڕاوێژ بە مامۆستایانی شەرعی بکەن.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
