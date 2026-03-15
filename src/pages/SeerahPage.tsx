import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Star,
  Sparkles,
  Moon,
  Sun
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { Button } from "@/components/ui/button";

interface SeerahEvent {
  id: number;
  title: string;
  titleArabic: string;
  date: string;
  hijriDate: string;
  description: string;
  importance?: "high" | "medium" | "low";
}

interface SeerahPeriod {
  id: number;
  period: string;
  periodArabic: string;
  events: SeerahEvent[];
}

// Event Detail Modal
const EventModal = memo(({
  event,
  onClose
}: {
  event: SeerahEvent | null;
  onClose: () => void;
}) => {
  if (!event) return null;

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
          className="bg-background rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-primary/20 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="relative p-6 bg-gradient-to-bl from-primary/20 via-primary/10 to-transparent">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold font-naskh text-foreground leading-tight">
                      {event.title}
                    </h2>
                    <p className="text-sm text-muted-foreground font-arabic mt-1">
                      {event.titleArabic}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Date badge */}
              {event.date && (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </span>
                  {event.hijriDate && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
                      <Moon className="w-4 h-4" />
                      {event.hijriDate}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-loose text-foreground/90 font-naskh text-lg text-justify">
                {event.description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-end">
            <Button onClick={onClose} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              گەڕانەوە
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
EventModal.displayName = 'EventModal';

// Period accordion component
const PeriodCard = memo(({
  period,
  index,
  isExpanded,
  onToggle,
  onEventClick
}: {
  period: SeerahPeriod;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEventClick: (event: SeerahEvent) => void;
}) => {
  const importanceColors = {
    high: "border-primary/50 bg-primary/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    low: "border-muted-foreground/20 bg-muted/5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl overflow-hidden border border-border/50"
    >
      {/* Period Header */}
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-bold text-lg">{index + 1}</span>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-xl font-naskh text-foreground">
              {period.period}
            </h3>
            <p className="text-sm text-muted-foreground font-arabic">
              {period.periodArabic}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {period.events.length} ڕووداو
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Events List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {/* Timeline connector */}
              <div className="relative">
                <div className="absolute right-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
                
                {period.events.map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: eventIndex * 0.05 }}
                    onClick={() => onEventClick(event)}
                    className={`relative pr-10 py-3 cursor-pointer group ${
                      eventIndex !== period.events.length - 1 ? 'mb-2' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${
                      event.importance === 'high' 
                        ? 'border-primary bg-primary/20' 
                        : event.importance === 'medium'
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-muted-foreground bg-muted'
                    } transition-all group-hover:scale-125`} />

                    <div className={`p-4 rounded-xl border transition-all ${
                      importanceColors[event.importance || 'low']
                    } group-hover:border-primary/50 group-hover:shadow-md`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold font-naskh text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </h4>
                          {event.date && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{event.date}</span>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
PeriodCard.displayName = 'PeriodCard';

export default function SeerahPage() {
  const [seerahData, setSeerahData] = useState<SeerahPeriod[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SeerahEvent | null>(null);
  const [expandedPeriods, setExpandedPeriods] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/seerah.json`)
      .then(res => res.json())
      .then(data => {
        setSeerahData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const togglePeriod = (id: number) => {
    setExpandedPeriods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedPeriods(new Set(seerahData.map(p => p.id)));
  };

  const collapseAll = () => {
    setExpandedPeriods(new Set());
  };

  // Filter periods and events based on search
  const filteredData = seerahData.map(period => ({
    ...period,
    events: period.events.filter(event =>
      event.title.includes(searchQuery) ||
      event.titleArabic.includes(searchQuery) ||
      event.description.includes(searchQuery) ||
      event.date.includes(searchQuery)
    )
  })).filter(period => 
    period.period.includes(searchQuery) ||
    period.periodArabic.includes(searchQuery) ||
    period.events.length > 0
  );

  // Count total events
  const totalEvents = seerahData.reduce((sum, p) => sum + p.events.length, 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <GeometricPattern />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute -top-2 -right-2"
              >
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              </motion.div>
            </div>

            <h1 className="font-naskh text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              سیرەی پێغەمبەر
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-2">
              ژیاننامەی پێغەمبەری ئیسلام محمد (صلى الله عليه وسلم)
            </p>
            <p className="text-sm text-muted-foreground">
              {seerahData.length} بەش • {totalEvents} ڕووداو
            </p>
          </motion.div>

          {/* Search and controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="گەڕان لە ڕووداوەکان..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pr-10 h-12 text-lg glass-card border-primary/20"
              />
            </div>

            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={expandAll}
                className="gap-1.5 text-xs"
              >
                <ChevronDown className="w-3 h-3" />
                کردنەوەی هەموو
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={collapseAll}
                className="gap-1.5 text-xs"
              >
                <ChevronUp className="w-3 h-3" />
                داخستنی هەموو
              </Button>
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-naskh">بارکردنی سیرەی پێغەمبەر...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-naskh">هیچ ڕووداوێک نەدۆزرایەوە</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((period, index) => (
                <PeriodCard
                  key={period.id}
                  period={period}
                  index={index}
                  isExpanded={expandedPeriods.has(period.id)}
                  onToggle={() => togglePeriod(period.id)}
                  onEventClick={setSelectedEvent}
                />
              ))}
            </div>
          )}

          {/* Source attribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>سەرچاوە: الرحيق المختوم</p>
          </motion.div>
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
