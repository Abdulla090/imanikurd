import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Home, Menu, X, ScrollText, FileText, ListChecks, GraduationCap, Moon, Sun, Clock, Sparkles, Circle, Calculator, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QiblaIndicator } from "./QiblaIndicator";

const navItems = [
  { name: "سەرەکی", path: "/", icon: Home },
  { name: "قورئان", path: "/quran", icon: Book },
  { name: "حەدیس", path: "/hadith", icon: ScrollText },
  { name: "ئەزکار", path: "/azkar", icon: Sparkles },
  { name: "تەسبیح", path: "/tasbih", icon: Circle },
  { name: "شوێنکەوتن", path: "/tracker", icon: ListChecks },
  { name: "کاتی نوێژ", path: "/prayer-times", icon: Clock },
  { name: "زەکات", path: "/zakat", icon: Calculator },
  { name: "میرات", path: "/mirat", icon: Scale },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-arabic text-xl font-bold">
                  ئ
                </div>
                <div className="text-right">
                  <span className="font-naskh text-lg font-bold text-foreground block">ئیمان</span>
                  <span className="text-xs text-muted-foreground">کۆمەڵگەی ئیسلامی</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-2">
                <QiblaIndicator />

                {/* Dark Mode Toggle - Desktop */}
                <button
                  onClick={toggleDarkMode}
                  className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center hover:bg-muted transition-colors"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-accent" />
                  ) : (
                    <Moon className="w-5 h-5 text-primary" />
                  )}
                </button>

                {/* Mobile Menu Button - inside common container for alignment */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Slides from Right (RTL) - GPU Optimized */}
        <AnimatePresence mode="sync">
          {isOpen && (
            <>
              {/* Backdrop - Simple fade, no blur during animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "linear" }}
                className="fixed inset-0 bg-black/30 lg:hidden z-40"
                style={{ willChange: "opacity" }}
                onClick={() => setIsOpen(false)}
              />
              {/* Menu Panel - GPU accelerated slide */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "tween",
                  duration: 0.25,
                  ease: [0.32, 0.72, 0, 1]
                }}
                className="fixed top-0 right-0 h-full w-72 max-w-[80vw] glass-card rounded-r-none rounded-l-3xl lg:hidden z-50 shadow-2xl"
                style={{ willChange: "transform", transform: "translateZ(0)" }}
              >
                <div className="p-6 space-y-2 h-full overflow-y-auto">
                  {/* Close Button */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-naskh text-lg font-bold text-foreground">مێنیو</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* No staggered animations - instant render for performance */}
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}

                  {/* Dark Mode Toggle - Mobile */}
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-foreground hover:bg-muted w-full"
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-5 h-5 text-accent" />
                        <span>ڕووناکی</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5 text-primary" />
                        <span>تاریکی</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
