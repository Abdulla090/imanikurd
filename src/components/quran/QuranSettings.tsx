
import { memo } from "react";
import { BookOpen, Layers, Volume2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Qari, TAFSIR_OPTIONS, QARI_OPTIONS } from "./";

interface QuranSettingsProps {
    viewMode: "card" | "list" | "book";
    setViewMode: (mode: "card" | "list" | "book") => void;
    selectedTafsir: string;
    setSelectedTafsir: (id: string) => void;
    selectedQari: Qari;
    setSelectedQari: (qari: Qari) => void;
    showTafsir: boolean;
    setShowTafsir: (show: boolean) => void;
}

export const QuranSettings = memo(function QuranSettings({
    viewMode,
    setViewMode,
    selectedTafsir,
    setSelectedTafsir,
    selectedQari,
    setSelectedQari,
    showTafsir,
    setShowTafsir
}: QuranSettingsProps) {
    return (
        <div className="space-y-6 py-4">
            {/* View Mode */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <Label className="text-sm font-medium">شێوازی خوێندنەوە</Label>
                </div>
                <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as any)} className="justify-start w-full">
                    <ToggleGroupItem value="card" className="flex-1 text-xs" aria-label="Card View">
                        کارت
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" className="flex-1 text-xs" aria-label="List View">
                        لیست
                    </ToggleGroupItem>
                    <ToggleGroupItem value="book" className="flex-1 text-xs" aria-label="Book View">
                        کتێب
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <Separator />

            {/* Tafsir Settings */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <Label className="text-sm font-medium">تەفسیر</Label>
                    </div>
                    <Switch
                        checked={showTafsir}
                        onCheckedChange={setShowTafsir}
                    />
                </div>

                {showTafsir && (
                    <Select value={selectedTafsir} onValueChange={setSelectedTafsir}>
                        <SelectTrigger className="w-full text-right dir-rtl">
                            <SelectValue placeholder="تەفسیر هەڵبژێرە" />
                        </SelectTrigger>
                        <SelectContent>
                            {TAFSIR_OPTIONS.map((opt) => (
                                <SelectItem key={opt.id} value={opt.id} className="text-right dir-rtl">
                                    {opt.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <Separator />

            {/* Audio Settings (Qari) */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Volume2 className="w-4 h-4" />
                    <Label className="text-sm font-medium">قورئان خوێن</Label>
                </div>
                <Select
                    value={selectedQari.id}
                    onValueChange={(val) => {
                        const qari = QARI_OPTIONS.find(q => q.id === val);
                        if (qari) setSelectedQari(qari);
                    }}
                >
                    <SelectTrigger className="w-full text-right dir-rtl">
                        <SelectValue placeholder="قورئان خوێن هەڵبژێرە" />
                    </SelectTrigger>
                    <SelectContent>
                        {QARI_OPTIONS.map((qari) => (
                            <SelectItem key={qari.id} value={qari.id} className="text-right dir-rtl">
                                {qari.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
});
