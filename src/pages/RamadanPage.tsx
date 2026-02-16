import { Navigation } from "@/components/Navigation";
import { GeometricPattern } from "@/components/GeometricPattern";
import { RamadanHeader } from "@/components/ramadan/RamadanHeader";
import { RamadanTracker } from "@/components/ramadan/RamadanTracker";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function RamadanPage() {
    return (
        <div className="relative min-h-screen overflow-hidden" dir="rtl">
            <GeometricPattern />
            <Navigation />

            <main className="relative z-10 pt-24 sm:pt-32 pb-20 sm:pb-24 px-3 sm:px-4 md:px-6">
                <div className="w-full max-w-2xl mx-auto">
                    <RamadanHeader />
                    <RamadanTracker />
                </div>
            </main>

            <ScrollToTop />
        </div>
    );
}
