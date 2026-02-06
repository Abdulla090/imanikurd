import { useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { cn } from "@/lib/utils";

const wuduSteps = [
  {
    id: 1,
    title: "نیەت",
    arabic: "النية",
    description: "نیەت بکە بۆ دەستنوێژ گرتن بۆ پاکبوونەوە",
  },
  {
    id: 2,
    title: "شوشتنی دەست",
    arabic: "غسل اليدين",
    description: "دەستەکانت بشۆ هەتا مەچەک سێ جار",
  },
  {
    id: 3,
    title: "مەزمەزە",
    arabic: "المضمضة",
    description: "ئاو بخە دەمتەوە و بیڕشێنەرەوە سێ جار",
  },
  {
    id: 4,
    title: "ئاوەڵێوکردن",
    arabic: "الاستنشاق",
    description: "ئاو ڕابکێشە لوتەوە و بیڕشێنەرەوە سێ جار",
  },
  {
    id: 5,
    title: "شوشتنی ڕوو",
    arabic: "غسل الوجه",
    description: "ڕووخسارت بشۆ لە ڕەستی قژەوە هەتا ژێر چەناگە سێ جار",
  },
  {
    id: 6,
    title: "شوشتنی باڵ",
    arabic: "غسل اليدين إلى المرفقين",
    description: "باڵەکانت بشۆ هەتا ئەنیشک سێ جار، لە ڕاست دەستپێبکە",
  },
  {
    id: 7,
    title: "ماڵینی سەر",
    arabic: "مسح الرأس",
    description: "دەستی تەڕت بکێشە سەر سەرت یەک جار",
  },
  {
    id: 8,
    title: "ماڵینی گوێ",
    arabic: "مسح الأذنين",
    description: "گوێکانت بماڵە لە ناوەوە و دەرەوە",
  },
  {
    id: 9,
    title: "شوشتنی پێ",
    arabic: "غسل القدمين",
    description: "پێیەکانت بشۆ هەتا قاپەچک سێ جار، لە ڕاست دەستپێبکە",
  },
];

const prayerSteps = [
  {
    id: 1,
    title: "تەکبیرەتول ئیحرام",
    arabic: "تكبيرة الإحرام",
    description: "ڕاوەستە و دەستەکانت بهێڵەرەوە هەتا گوێکانت و بڵێ: الله أكبر",
  },
  {
    id: 2,
    title: "خوێندنی فاتحە",
    arabic: "قراءة الفاتحة",
    description: "سورەتی فاتحە بخوێنەرەوە",
  },
  {
    id: 3,
    title: "خوێندنی سورەت",
    arabic: "قراءة سورة",
    description: "سورەتێکی کورت بخوێنەرەوە",
  },
  {
    id: 4,
    title: "ڕوکوع",
    arabic: "الركوع",
    description: "سەرت دابنەوێنە و بڵێ: سبحان ربي العظيم (٣ جار)",
  },
  {
    id: 5,
    title: "هەڵستانەوە لە ڕوکوع",
    arabic: "الرفع من الركوع",
    description: "هەڵسەرەوە و بڵێ: سمع الله لمن حمده، ربنا ولك الحمد",
  },
  {
    id: 6,
    title: "سوجدە",
    arabic: "السجود",
    description: "سوجدە ببە و بڵێ: سبحان ربي الأعلى (٣ جار)",
  },
  {
    id: 7,
    title: "دانیشتن لەنێوان سوجدەکان",
    arabic: "الجلوس بين السجدتين",
    description: "دابنیشە و بڵێ: رب اغفر لي",
  },
  {
    id: 8,
    title: "سوجدەی دووەم",
    arabic: "السجدة الثانية",
    description: "سوجدەی دووەم ببە وەک یەکەم",
  },
  {
    id: 9,
    title: "تەشەهود",
    arabic: "التشهد",
    description: "لە ڕکاتی دووەم و کۆتایی: التحیات بخوێنەرەوە",
  },
  {
    id: 10,
    title: "سەلام",
    arabic: "التسليم",
    description: "سەرت بسوڕێنە ڕاست و چەپ و بڵێ: السلام عليكم ورحمة الله",
  },
];

export default function TutorialPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<"wudu" | "prayer">("wudu");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = selectedTutorial === "wudu" ? wuduSteps : prayerSteps;
  const currentStepData = steps[currentStep];

  const toggleStepComplete = (stepId: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

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
              فێرکاری
            </h1>
            <p className="text-muted-foreground">
              فێربوونی چۆنیەتی دەستنوێژ و نوێژکردن
            </p>
          </motion.div>

          {/* Tutorial Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8"
          >
            <Button
              variant={selectedTutorial === "wudu" ? "default" : "outline"}
              onClick={() => {
                setSelectedTutorial("wudu");
                setCurrentStep(0);
                setCompletedSteps([]);
              }}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              دەستنوێژ
            </Button>
            <Button
              variant={selectedTutorial === "prayer" ? "default" : "outline"}
              onClick={() => {
                setSelectedTutorial("prayer");
                setCurrentStep(0);
                setCompletedSteps([]);
              }}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              نوێژ
            </Button>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "w-3 h-3 rounded-full transition-all cursor-pointer",
                  index === currentStep
                    ? "bg-primary w-6"
                    : completedSteps.includes(step.id)
                      ? "bg-primary/50"
                      : "bg-muted"
                )}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          {/* Current Step */}
          <motion.div
            key={`${selectedTutorial}-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="ayat-container mb-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <span className="font-arabic text-2xl font-bold text-primary">{currentStep + 1}</span>
              </div>

              <h2 className="font-naskh text-2xl font-bold text-foreground mb-2">
                {currentStepData.title}
              </h2>
              <p className="font-arabic text-xl text-accent mb-4">{currentStepData.arabic}</p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>

              <Button
                variant={completedSteps.includes(currentStepData.id) ? "default" : "outline"}
                className="mt-6 gap-2"
                onClick={() => toggleStepComplete(currentStepData.id)}
              >
                {completedSteps.includes(currentStepData.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    تەواوکرا
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    تەواوکردن
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={goPrev}
              disabled={currentStep === 0}
              className="gap-2"
            >
              پێشوو
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={goNext}
              disabled={currentStep === steps.length - 1}
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              دواتر
            </Button>
          </div>

          {/* Steps List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="font-naskh text-lg font-bold text-foreground mb-4 text-center">
              هەموو هەنگاوەکان
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "feature-card flex items-center gap-3 text-right",
                    index === currentStep && "ring-2 ring-primary"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      completedSteps.includes(step.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-sm text-foreground">{step.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
