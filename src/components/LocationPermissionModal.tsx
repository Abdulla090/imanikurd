import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Compass, X, ChevronDown, Navigation, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Kurdistan cities with coordinates
const KURDISTAN_CITIES = [
    { id: 'erbil', name: 'هەولێر', lat: 36.1901, lng: 44.0091 },
    { id: 'sulaymaniyah', name: 'سلێمانی', lat: 35.5570, lng: 45.4370 },
    { id: 'duhok', name: 'دهۆک', lat: 36.8670, lng: 42.9900 },
    { id: 'kirkuk', name: 'کەرکوک', lat: 35.4680, lng: 44.3920 },
    { id: 'zakho', name: 'زاخۆ', lat: 37.1500, lng: 42.6800 },
    { id: 'halabja', name: 'ھەڵەبجە', lat: 35.1800, lng: 45.9800 },
    { id: 'ranya', name: 'ڕانیە', lat: 36.2530, lng: 44.8820 },
    { id: 'koya', name: 'کۆیە', lat: 36.0830, lng: 44.6300 },
    { id: 'soran', name: 'سۆران', lat: 36.6530, lng: 44.5420 },
    { id: 'choman', name: 'چومان', lat: 36.6280, lng: 44.8850 },
    { id: 'penjwin', name: 'پێنجوین', lat: 35.6170, lng: 45.9400 },
    { id: 'shaqlawa', name: 'شەقڵاوە', lat: 36.4050, lng: 44.3210 },
    { id: 'akre', name: 'ئاکرێ', lat: 36.7420, lng: 43.8900 },
    { id: 'rawanduz', name: 'ڕەواندز', lat: 36.6150, lng: 44.5280 },
];

interface LocationPermissionModalProps {
    onGranted: (coords: { lat: number; lng: number }) => void;
    onDenied: () => void;
}

export function LocationPermissionModal({ onGranted, onDenied }: LocationPermissionModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [showCitySelector, setShowCitySelector] = useState(false);
    const [selectedCity, setSelectedCity] = useState<typeof KURDISTAN_CITIES[0] | null>(null);

    useEffect(() => {
        // Check if we already have permission or location stored
        const storedLocation = localStorage.getItem('user-location');
        if (storedLocation) {
            const coords = JSON.parse(storedLocation);
            onGranted(coords);
            return;
        }

        // Check permission status
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'granted') {
                    requestLocation();
                } else if (result.state === 'prompt') {
                    // Show our custom modal first
                    setIsOpen(true);
                } else {
                    // Permission denied previously - show city selector
                    setIsOpen(true);
                    setShowCitySelector(true);
                }
            });
        } else {
            // Fallback: show modal
            setIsOpen(true);
        }
    }, []);

    const requestLocation = () => {
        setIsRequesting(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                localStorage.setItem('user-location', JSON.stringify(coords));
                setIsOpen(false);
                setIsRequesting(false);
                onGranted(coords);
            },
            (error) => {
                console.error('Location error:', error);
                setIsRequesting(false);
                // Show city selector as fallback
                setShowCitySelector(true);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleAllow = () => {
        requestLocation();
    };

    const handleSelectCity = (city: typeof KURDISTAN_CITIES[0]) => {
        setSelectedCity(city);
    };

    const handleConfirmCity = () => {
        if (selectedCity) {
            const coords = { lat: selectedCity.lat, lng: selectedCity.lng };
            localStorage.setItem('user-location', JSON.stringify(coords));
            localStorage.setItem('user-city-name', selectedCity.name);
            setIsOpen(false);
            onGranted(coords);
        }
    };

    const handleDeny = () => {
        // Default to Erbil
        const defaultCoords = { lat: 36.1901, lng: 44.0091 };
        localStorage.setItem('user-location', JSON.stringify(defaultCoords));
        localStorage.setItem('user-city-name', 'هەولێر');
        setIsOpen(false);
        onDenied();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-background rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
                    >
                        {!showCitySelector ? (
                            // GPS Permission View
                            <>
                                {/* Header with Mosque Icon */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                                        <span className="text-3xl">🕌</span>
                                    </div>
                                    <button
                                        onClick={handleDeny}
                                        className="p-2 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <X className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Title - More Urgent */}
                                <h2 className="text-xl font-bold text-foreground mb-2">
                                    کاتی نوێژ بە وردی؟
                                </h2>

                                {/* Description - More Persuasive */}
                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                    بۆ ئەوەی <strong className="text-primary">کاتی نوێژ</strong> و <strong className="text-primary">ئاڕاستەی قیبلە</strong> ڕاست بن بۆ شوێنەکەی تۆ، پێویستمان بە شوێنت هەیە.
                                </p>

                                {/* Visual Warning */}
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
                                    <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                                        <span className="text-lg">⚠️</span>
                                        <span>
                                            بەبێ شوێن، کاتی نوێژ لەوانەیە <strong>چەند خولەک</strong> جیاواز بێت لە کاتی ڕاست!
                                        </span>
                                    </p>
                                </div>

                                {/* Features that need location */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">کاتی نوێژ ڕاست</p>
                                            <p className="text-xs text-muted-foreground">بەگوێرەی شارەکەت</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <Compass className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">ئاڕاستەی قیبلە</p>
                                            <p className="text-xs text-muted-foreground">ڕوو بۆ کەعبەی پیرۆز</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Privacy note */}
                                <p className="text-xs text-muted-foreground/70 mb-4 text-center flex items-center justify-center gap-1">
                                    🔒 شوێنەکەت تەنها لە ئامێرەکەت هەڵدەگیرێت
                                </p>

                                {/* Actions */}
                                <div className="space-y-2">
                                    <Button
                                        className="w-full gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90"
                                        onClick={handleAllow}
                                        disabled={isRequesting}
                                    >
                                        {isRequesting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                چاوەڕوان بە...
                                            </>
                                        ) : (
                                            <>
                                                <Navigation className="w-4 h-4" />
                                                بەڵێ، ڕێگەپێدان بە شوێن
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => setShowCitySelector(true)}
                                        disabled={isRequesting}
                                    >
                                        <Building2 className="w-4 h-4" />
                                        شارەکەم هەڵبژێرم
                                    </Button>
                                </div>
                            </>
                        ) : (
                            // City Selector View
                            <>
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-7 h-7 text-primary" />
                                    </div>
                                    <button
                                        onClick={handleDeny}
                                        className="p-2 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <X className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold text-foreground mb-2">
                                    شارەکەت هەڵبژێرە
                                </h2>

                                <p className="text-muted-foreground text-sm mb-4">
                                    شارەکەت هەڵبژێرە بۆ کاتی نوێژ و ئاڕاستەی قیبلە:
                                </p>

                                {/* City Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-4 max-h-[300px] overflow-y-auto">
                                    {KURDISTAN_CITIES.map((city) => (
                                        <button
                                            key={city.id}
                                            onClick={() => handleSelectCity(city)}
                                            className={`p-3 rounded-xl text-center transition-all ${selectedCity?.id === city.id
                                                    ? 'bg-primary text-primary-foreground scale-[1.02] shadow-md'
                                                    : 'bg-muted/50 hover:bg-muted text-foreground'
                                                }`}
                                        >
                                            <span className="font-medium text-sm">{city.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="space-y-2">
                                    <Button
                                        className="w-full gap-2"
                                        onClick={handleConfirmCity}
                                        disabled={!selectedCity}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        {selectedCity ? `${selectedCity.name} هەڵبژێرە` : 'شارێک هەڵبژێرە'}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full text-sm"
                                        onClick={() => setShowCitySelector(false)}
                                    >
                                        گەڕانەوە
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook to use location
export function useLocation() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('user-location');
        if (stored) {
            setLocation(JSON.parse(stored));
        } else {
            setShowModal(true);
        }
    }, []);

    return {
        location,
        showModal,
        permissionDenied,
        setLocation,
        setShowModal,
        setPermissionDenied,
    };
}

