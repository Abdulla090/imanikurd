import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, X } from "lucide-react";

export function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowMessage(true);
        };

        // Set initial state
        setIsOnline(navigator.onLine);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {showMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 ${isOnline
                            ? "bg-green-500 text-white"
                            : "bg-destructive text-destructive-foreground"
                        }`}
                >
                    {isOnline ? (
                        <>
                            <Wifi className="w-4 h-4" />
                            <span className="text-sm font-medium">پەیوەندی گەڕایەوە</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4" />
                            <span className="text-sm font-medium">پەیوەندی نیە</span>
                        </>
                    )}
                    <button
                        onClick={() => setShowMessage(false)}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
