import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense, useState, useEffect, memo } from "react";
import { AnimatePresence } from "framer-motion";

// Lazy load pages for better initial load
const Index = lazy(() => import("./pages/Index"));
const QuranPage = lazy(() => import("./pages/QuranPage"));
const HadithPage = lazy(() => import("./pages/HadithPage"));
const EvidencePage = lazy(() => import("./pages/EvidencePage"));
const TrackerPage = lazy(() => import("./pages/TrackerPage"));
const TutorialPage = lazy(() => import("./pages/TutorialPage"));
const PrayerTimesPage = lazy(() => import("./pages/PrayerTimesPage"));
const AzkarPage = lazy(() => import("./pages/AzkarPage"));
const TasbihPage = lazy(() => import("./pages/TasbihPage"));
const SecretKeyPage = lazy(() => import("./pages/SecretKeyPage"));
const StartPage = lazy(() => import("./pages/StartPage"));
const ZakatPage = lazy(() => import("./pages/ZakatPage"));
const MiratPage = lazy(() => import("./pages/MiratPage"));
const NamesOfAllahPage = lazy(() => import("./pages/NamesOfAllahPage"));
const CompanionsPage = lazy(() => import("./pages/CompanionsPage"));
const SeerahPage = lazy(() => import("./pages/SeerahPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const MediaPage = lazy(() => import("./pages/MediaPage"));

const RamadanPage = lazy(() => import("./pages/RamadanPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { ChatBubble } from "./components/ChatBubble";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { PageTransition } from "./components/PageTransition";
import { AutoScrollToTop } from "./components/AutoScrollToTop";
import { LoadingScreen } from "./components/LoadingScreen";

// Create QueryClient outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Simple loading fallback - no heavy Lottie animation for route changes
const SuspenseLoader = memo(() => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-primary font-naskh text-lg">ئیمان</span>
    </div>
  </div>
));
SuspenseLoader.displayName = 'SuspenseLoader';

// ChatBubble wrapper - shows only on home and explore
const GlobalChatBubble = memo(() => {
  const location = useLocation();
  const showButton = location.pathname === '/' || location.pathname === '/start' || location.pathname === '/explore';
  
  return <ChatBubble hideButton={!showButton} />;
});
GlobalChatBubble.displayName = 'GlobalChatBubble';

// Redirect /chat to home while opening the chat bubble
const ChatRedirect = () => {
  useEffect(() => {
    // Small delay to ensure ChatBubble is mounted
    setTimeout(() => {
      window.dispatchEvent(new Event('open-chat-bubble'));
    }, 100);
  }, []);
  return <Navigate to="/" replace />;
};

const App = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Hide the initial HTML loader immediately
    document.body.classList.add('app-ready');

    // Reduced initial app load time for snappier feel
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800); // Reduced from 2000ms to 800ms
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* Initial Load Screen */}
        <LoadingScreen isLoading={initialLoading} />

        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AutoScrollToTop />
          <OfflineIndicator />

          <Suspense fallback={<SuspenseLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                <Route path="/quran" element={<PageTransition><QuranPage /></PageTransition>} />
                <Route path="/hadith" element={<PageTransition><HadithPage /></PageTransition>} />
                <Route path="/evidence" element={<PageTransition><EvidencePage /></PageTransition>} />
                <Route path="/tracker" element={<PageTransition><TrackerPage /></PageTransition>} />
                <Route path="/tutorial" element={<PageTransition><TutorialPage /></PageTransition>} />
                <Route path="/prayer-times" element={<PageTransition><PrayerTimesPage /></PageTransition>} />
                <Route path="/azkar" element={<PageTransition><AzkarPage /></PageTransition>} />
                <Route path="/tasbih" element={<PageTransition><TasbihPage /></PageTransition>} />
                <Route path="/iman-secret-config-99" element={<PageTransition><SecretKeyPage /></PageTransition>} />
                <Route path="/start" element={<PageTransition><StartPage /></PageTransition>} />
                <Route path="/zakat" element={<PageTransition><ZakatPage /></PageTransition>} />
                <Route path="/mirat" element={<PageTransition><MiratPage /></PageTransition>} />
                <Route path="/names" element={<PageTransition><NamesOfAllahPage /></PageTransition>} />
                <Route path="/seerah" element={<PageTransition><SeerahPage /></PageTransition>} />
                <Route path="/companions" element={<PageTransition><CompanionsPage /></PageTransition>} />
                <Route path="/library" element={<PageTransition><LibraryPage /></PageTransition>} />
                <Route path="/media" element={<PageTransition><MediaPage /></PageTransition>} />
                <Route path="/chat" element={<ChatRedirect />} />
                <Route path="/ramadan" element={<PageTransition><RamadanPage /></PageTransition>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>

          {/* Chat Bubble - Available on all pages */}
          <GlobalChatBubble />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;


