
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import QiblaCompass from "@/components/QiblaCompass";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Clock } from "lucide-react";

export default function PrayerTimesPage() {
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
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-naskh text-4xl md:text-5xl font-bold text-foreground mb-4">
              کاتی نوێژ و قیبلە
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تەواوی کاتەکانی نوێژ لە شارەکانی هەرێمی کوردستان و دیاری کردنی قیبلە
            </p>
          </motion.div>

          <Tabs defaultValue="prayer" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-background/60 backdrop-blur-md p-1 h-14 rounded-full border border-primary/20">
                <TabsTrigger value="prayer" className="rounded-full px-6 h-12 gap-2 text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <Clock className="w-5 h-5" />
                  کاتی نوێژ
                </TabsTrigger>
                <TabsTrigger value="qibla" className="rounded-full px-6 h-12 gap-2 text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <Compass className="w-5 h-5" />
                  قیبلە نما
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="prayer">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PrayerTimesCard />
              </motion.div>
            </TabsContent>

            <TabsContent value="qibla">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center pt-8"
              >
                <QiblaCompass />
              </motion.div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
