import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
                >
                    {/* Lottie Animation */}
                    <div className="w-64 h-64 md:w-80 md:h-80">
                        <DotLottieReact
                            src="/loading.lottie"
                            autoplay
                            loop
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>

                    {/* App Name */}
                    <p className="mt-4 text-primary text-xl font-bold font-naskh">
                        ئیمان
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
