import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Book, ScrollText, FileText, ListChecks, GraduationCap,
    Sparkles, Star, Clock, Moon, Circle, Calculator, Scale, Users, BookOpen, Library, Bot, Tv
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";

const allFeatures = [
    {
        icon: Book,
        title: "قورئانی پیرۆز",
        subtitle: "تەفسیری کوردی",
        description: "خوێندنەوەی قورئان بە عەرەبی و کوردی سۆرانی",
        link: "/quran",
        color: "bg-green-500/10 text-green-600",
    },
    {
        icon: ScrollText,
        title: "حەدیسەکان",
        subtitle: "صحیح بوخاری و موسلیم",
        description: "کۆکراوەی حەدیسی صەحیح بە لێکدانەوەی کوردی",
        link: "/hadith",
        color: "bg-emerald-500/10 text-emerald-600",
    },
    {
        icon: Bot,
        title: "یاریدەدەری AI",
        subtitle: "پرسیار لە ئیسلام",
        description: "پرسیارەکانت لەسەر ئیسلام بکە و وەڵامی زیرەک وەربگرە",
        link: "/chat",
        color: "bg-violet-500/10 text-violet-600",
        action: () => window.dispatchEvent(new Event('open-chat-bubble')),
    },
    {
        icon: BookOpen,
        title: "سیرەی پێغەمبەر",
        subtitle: "ژیاننامەی محمد ﷺ",
        description: "ژیاننامەی تەواوی پێغەمبەری ئیسلام لە لەدایکبوون تا کۆچی دوایی",
        link: "/seerah",
        color: "bg-emerald-500/10 text-emerald-600",
    },
    {
        icon: Users,
        title: "هاوەڵانی پێغەمبەر",
        subtitle: "ژیاننامەی هاوەڵان",
        description: "ژیاننامە و بەسەرهاتی هاوەڵە بەڕێزەکان",
        link: "/companions",
        color: "bg-cyan-500/10 text-cyan-600",
    },
    /* Temporarily Disabled
    {
        icon: Library,
        title: "کتێبخانەی ئیسلامی",
        subtitle: "کتێب و وتار و ڤیدیۆ",
        description: "کتێب، وتار، دەنگ و ڤیدیۆی ئیسلامی بە کوردی",
        link: "/library",
        color: "bg-purple-500/10 text-purple-600",
    },
    */
    {
        icon: Tv,
        title: "میدیای ئیسلامی",
        subtitle: "پۆدکاست و ڤیدیۆ",
        description: "پۆدکاستی ئیسلامی، وتاری کوردی و عەرەبی و تلاوەتی قورئان",
        link: "/media",
        color: "bg-red-500/10 text-red-600",
    },
    {
        icon: Clock,
        title: "کاتی نوێژەکان",
        subtitle: "بۆ شوێنی ئێستات",
        description: "کاتی دروست و ڕاستی نوێژەکان لە هەر شوێنێک",
        link: "/prayer-times",
        color: "bg-blue-500/10 text-blue-600",
    },
    {
        icon: Moon,
        title: "ئەزکار",
        subtitle: "بەیانی و ئێوارە",
        description: "ئەزکار و دوعاکانی بەیانی و ئێوارە بە ژمێرەر",
        link: "/azkar",
        color: "bg-indigo-500/10 text-indigo-600",
    },
    {
        icon: Sparkles,
        title: "ناوەکانی خودا",
        subtitle: "٩٩ ناوی پیرۆز",
        description: "ناوە پیرۆزەکانی خوا بە واتای کوردی",
        link: "/names",
        color: "bg-violet-500/10 text-violet-600",
    },
    {
        icon: Circle,
        title: "تەسبیح",
        subtitle: "ژمێرەری دیجیتاڵ",
        description: "تەسبیحی دیجیتاڵ بۆ ژمارەکردنی ذیکر و ستایش",
        link: "/tasbih",
        color: "bg-pink-500/10 text-pink-600",
    },
    {
        icon: ListChecks,
        title: "شوێنکەوتنی کردار",
        subtitle: "کارە چاکەکان",
        description: "تۆمارکردنی کارە چاکەکان و گوناهەکان",
        link: "/tracker",
        color: "bg-purple-500/10 text-purple-600",
    },
    {
        icon: Calculator,
        title: "ژمێرەری زەکات",
        subtitle: "زەکاتەکەت ئەژمار بکە",
        description: "ئەژمارکردنی بڕی زەکاتی ساڵانە لەسەر ماڵ و سامان",
        link: "/zakat",
        color: "bg-amber-500/10 text-amber-600",
    },
    {
        icon: Scale,
        title: "دابەشکردنی میرات",
        subtitle: "میراتی شەرعی",
        description: "ئەژمارکردنی بەشی میراتگرەکان بەپێی شەریعەت",
        link: "/mirat",
        color: "bg-teal-500/10 text-teal-600",
    },
    {
        icon: FileText,
        title: "بەڵگەکان",
        subtitle: "دەلیلی شەرعی",
        description: "بەڵگە و دەلیلی شەرعی بۆ بابەتە جیاوازەکان",
        link: "/evidence",
        color: "bg-teal-500/10 text-teal-600",
    },
    {
        icon: GraduationCap,
        title: "فێرکاری",
        subtitle: "نوێژ و دەستنوێژ",
        description: "فێربوونی چۆنیەتی دەستنوێژ و نوێژکردن بە وێنە",
        link: "/tutorial",
        color: "bg-orange-500/10 text-orange-600",
    },
];

export default function StartPage() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-4">
                <div className="w-full max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="font-naskh text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            هەموو خزمەتگوزارییەکان
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                            هەموو ئەو شتانەی پێویستتە لە یەک شوێن بۆ بەهێزکردنی ئیمانت و جێبەجێکردنی ئەرکە ئاینییەکانت
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {allFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                {feature.action ? (
                                    <div onClick={feature.action} className="feature-card block h-full p-6 relative overflow-hidden cursor-pointer">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />

                                        <div className="flex items-start gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${feature.color}`}>
                                                <feature.icon className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-naskh text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm font-medium text-primary/80">
                                                    {feature.subtitle}
                                                </p>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                                whileHover={{ x: -3 }}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </motion.div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={feature.link} className="feature-card block h-full p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />

                                        <div className="flex items-start gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${feature.color}`}>
                                                <feature.icon className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-naskh text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm font-medium text-primary/80">
                                                    {feature.subtitle}
                                                </p>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                                whileHover={{ x: -3 }}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </motion.div>
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
