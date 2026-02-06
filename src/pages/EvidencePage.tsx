import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";

const evidences = [
  {
    id: 1,
    title: "حیجابی ژنان",
    category: "پۆشاک",
    summary: "فەرزی داپۆشینی سەر و جەستە بۆ ژنان لە ئیسلامدا",
    details: "خودای گەورە لە قورئاندا فەرمووی: وَقُل لِّلْمُؤْمِنَاتِ يَغْضُضْنَ مِنْ أَبْصَارِهِنَّ وَيَحْفَظْنَ فُرُوجَهُنَّ وَلَا يُبْدِينَ زِينَتَهُنَّ إِلَّا مَا ظَهَرَ مِنْهَا ۖ وَلْيَضْرِبْنَ بِخُمُرِهِنَّ عَلَىٰ جُيُوبِهِنَّ (النور: ٣١)",
    sources: ["سورەتی النور: ٣١", "سورەتی الاحزاب: ٥٩"],
  },
  {
    id: 2,
    title: "نوێژی پێنج کات",
    category: "عیبادەت",
    summary: "فەرزی نوێژی پێنج کات لەسەر هەموو موسڵمانێک",
    details: "نوێژ ستوونی ئایینە و یەکەم شتە کە لە ڕۆژی قیامەتدا پرسیار لێ دەکرێت. پێغەمبەر (د.خ) فەرمووی: العهد الذي بيننا وبينهم الصلاة فمن تركها فقد كفر",
    sources: ["صحیح موسلیم", "سورەتی البقرة: ٤٣"],
  },
  {
    id: 3,
    title: "ڕۆژووی ڕەمەزان",
    category: "عیبادەت",
    summary: "فەرزی ڕۆژوو لە مانگی ڕەمەزاندا",
    details: "خودای گەورە فەرمووی: يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ (البقرة: ١٨٣)",
    sources: ["سورەتی البقرة: ١٨٣-١٨٥"],
  },
  {
    id: 4,
    title: "زەکات",
    category: "دارایی",
    summary: "فەرزی دەرکردنی زەکات لە ماڵی زیادە",
    details: "زەکات یەکێکە لە پێنج ڕوکنی ئیسلام و پاککردنەوەی ماڵە. خودای گەورە فەرمووی: خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا (التوبة: ١٠٣)",
    sources: ["سورەتی التوبة: ١٠٣"],
  },
];

export default function EvidencePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredEvidences = evidences.filter(
    (evidence) =>
      evidence.title.includes(searchQuery) ||
      evidence.category.includes(searchQuery) ||
      evidence.summary.includes(searchQuery)
  );

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
              بەڵگەکان
            </h1>
            <p className="text-muted-foreground">
              بەڵگە و دەلیلی شەرعی بۆ بابەتە جیاوازەکان
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full sm:max-w-md mx-auto mb-6 sm:mb-8"
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="گەڕان لە بەڵگەکان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </motion.div>

          {/* Evidence List */}
          <div className="space-y-4">
            {filteredEvidences.map((evidence, index) => (
              <motion.div
                key={evidence.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="feature-card"
              >
                <button
                  onClick={() => setExpandedId(expandedId === evidence.id ? null : evidence.id)}
                  className="w-full text-right"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-naskh text-lg font-bold text-foreground">{evidence.title}</h3>
                          <span className="text-xs text-primary">{evidence.category}</span>
                        </div>
                        {expandedId === evidence.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{evidence.summary}</p>
                    </div>
                  </div>
                </button>

                {expandedId === evidence.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border mr-14"
                  >
                    <p className="text-foreground leading-relaxed mb-4">{evidence.details}</p>
                    <div className="flex flex-wrap gap-2">
                      {evidence.sources.map((source, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                          {source}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
