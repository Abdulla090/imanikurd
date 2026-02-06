import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X, MapPin, Navigation2 } from "lucide-react";
import { Button } from "./ui/button";

export function QiblaIndicator() {
    const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
    const [deviceHeading, setDeviceHeading] = useState<number>(0);
    const [isOpen, setIsOpen] = useState(false);
    const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
    const [hasOrientationPermission, setHasOrientationPermission] = useState<boolean | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const calculateQibla = useCallback((latitude: number, longitude: number) => {
        // Mecca coordinates
        const meccaLat = 21.4225;
        const meccaLon = 39.8262;

        // Convert to radians
        const φ1 = latitude * (Math.PI / 180);
        const φ2 = meccaLat * (Math.PI / 180);
        const Δλ = (meccaLon - longitude) * (Math.PI / 180);

        // Bearing formula
        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

        let θ = Math.atan2(y, x);
        let bearing = (θ * 180 / Math.PI + 360) % 360;

        console.log(`Qibla bearing for (${latitude}, ${longitude}): ${bearing}°`);
        setQiblaAngle(bearing);
        return bearing;
    }, []);

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        let heading = 0;

        if ('webkitCompassHeading' in event && typeof (event as any).webkitCompassHeading === 'number') {
            // iOS - webkitCompassHeading gives compass heading directly
            heading = (event as any).webkitCompassHeading;
        } else if (event.alpha !== null) {
            // Android - alpha is the compass direction the device is facing
            // alpha = 0 means device points to North, alpha = 90 means East, etc.
            // We need to convert: when alpha = 0 (North), heading should be 0
            heading = (360 - event.alpha) % 360;
        }

        setDeviceHeading(heading);
    }, []);

    const requestOrientationPermission = useCallback(async () => {
        // Check if DeviceOrientationEvent exists (not available on desktop browsers)
        if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
            console.log("DeviceOrientationEvent not supported on this device");
            setHasOrientationPermission(false);
            return;
        }

        // iOS 13+ requires permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === 'granted') {
                    setHasOrientationPermission(true);
                    window.addEventListener('deviceorientation', handleOrientation, true);
                } else {
                    setHasOrientationPermission(false);
                }
            } catch (err) {
                console.error("Orientation permission error:", err);
                setHasOrientationPermission(false);
            }
        } else {
            // Android and older iOS - no permission needed
            setHasOrientationPermission(true);
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
    }, [handleOrientation]);

    const requestLocation = useCallback(() => {
        // First check localStorage for saved location from LocationPermissionModal
        const savedLocation = localStorage.getItem('user-location');
        if (savedLocation) {
            try {
                const parsed = JSON.parse(savedLocation);
                if (parsed.lat && parsed.lng) {
                    console.log("QiblaIndicator: Using saved location from localStorage:", parsed);
                    setUserLocation({ lat: parsed.lat, lng: parsed.lng });
                    calculateQibla(parsed.lat, parsed.lng);
                    setHasLocationPermission(true);
                    return;
                }
            } catch (e) {
                console.warn("QiblaIndicator: Failed to parse saved location:", e);
            }
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    calculateQibla(latitude, longitude);
                    setHasLocationPermission(true);
                    // Save to localStorage for future use
                    localStorage.setItem('user-location', JSON.stringify({ lat: latitude, lng: longitude }));
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setHasLocationPermission(false);
                    // Default to Erbil
                    setUserLocation({ lat: 36.1901, lng: 44.0091 });
                    calculateQibla(36.1901, 44.0091);
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        }
    }, [calculateQibla]);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    useEffect(() => {
        if (isOpen && hasOrientationPermission === null) {
            requestOrientationPermission();
        }
    }, [isOpen, hasOrientationPermission, requestOrientationPermission]);

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true);
        };
    }, [handleOrientation]);

    // Calculate the arrow rotation: Qibla direction relative to where device is pointing
    // The arrow should point toward Qibla, so we subtract device heading from Qibla angle
    const arrowRotation = qiblaAngle !== null ? (qiblaAngle - deviceHeading + 360) % 360 : 0;

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
            >
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">قیبلە</span>
                    <motion.div
                        animate={{ rotate: arrowRotation }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                        className="text-primary"
                    >
                        <Navigation2 className="w-4 h-4" fill="currentColor" />
                    </motion.div>
                </div>
                {(qiblaAngle !== null) && (
                    <div className="hidden sm:block text-[10px] text-muted-foreground font-mono">
                        {Math.round(qiblaAngle)}°
                    </div>
                )}
            </motion.button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative w-full max-w-sm"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="absolute -top-12 right-0 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </Button>

                                <div className="text-center space-y-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-white font-naskh">ئاراستەی قیبلە</h2>
                                        <p className="text-sm text-white/60">مۆبایلەکەت بسوڕێنە بۆ دۆزینەوەی ئاراستە</p>
                                    </div>

                                    {/* Compass Circle */}
                                    <div className="relative w-72 h-72 mx-auto">
                                        <div className="absolute inset-0 rounded-full border-2 border-white/20" />

                                        {/* Compass directions - rotate opposite to device heading */}
                                        <motion.div
                                            className="absolute inset-0"
                                            animate={{ rotate: -deviceHeading }}
                                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                                        >
                                            {Array.from({ length: 72 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute top-0 left-1/2 origin-bottom"
                                                    style={{
                                                        height: '50%',
                                                        transform: `translateX(-50%) rotate(${i * 5}deg)`,
                                                    }}
                                                >
                                                    <div
                                                        className={`w-px ${i % 6 === 0 ? 'h-4 bg-white/60' : 'h-2 bg-white/30'}`}
                                                    />
                                                </div>
                                            ))}

                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-bold text-red-400">N</div>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-lg font-bold text-white/50">S</div>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white/50">E</div>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white/50">W</div>
                                        </motion.div>

                                        <div className="absolute inset-[30%] rounded-full bg-gradient-to-b from-primary/30 to-primary/10 border border-primary/40" />

                                        {/* Qibla arrow - points toward Mecca */}
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            animate={{ rotate: arrowRotation }}
                                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                                        >
                                            <div className="relative h-full flex flex-col items-center">
                                                <div className="mt-8">
                                                    <Navigation2
                                                        className="w-12 h-12 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]"
                                                        fill="currentColor"
                                                    />
                                                </div>
                                                <div className="absolute top-1/2 -translate-y-1/2 text-2xl">🕋</div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mx-4">
                                        <div className="text-sm text-white/60 mb-1">ئاراستەی قیبلە</div>
                                        <div className="text-4xl font-bold font-mono text-primary">
                                            {qiblaAngle !== null ? Math.round(qiblaAngle) : "---"}°
                                        </div>
                                        <div className="text-xs text-white/40 mt-2">
                                            ئاراستەی ئامێرەکەت: {Math.round(deviceHeading)}°
                                        </div>
                                    </div>

                                    {(hasOrientationPermission === false || hasLocationPermission === false) && (
                                        <div className="space-y-3 mx-4">
                                            {hasLocationPermission === false && (
                                                <Button
                                                    onClick={requestLocation}
                                                    variant="outline"
                                                    className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    چالاککردنی شوێن
                                                </Button>
                                            )}
                                            {hasOrientationPermission === false && (
                                                <Button
                                                    onClick={requestOrientationPermission}
                                                    variant="outline"
                                                    className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                                                >
                                                    <Compass className="w-4 h-4" />
                                                    چالاککردنی کۆمپاس
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
