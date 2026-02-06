
import React, { useState, useEffect } from 'react';
import { Compass, RotateCcw, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const QiblaCompass = () => {
    const [heading, setHeading] = useState<number>(0);
    const [qiblaDate, setQiblaDate] = useState<number>(0);
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Kaaba coordinates
    const KAABA_LAT = 21.4225;
    const KAABA_LONG = 39.8262;

    const calculateQibla = (latitude: number, longitude: number) => {
        const phiK = KAABA_LAT * Math.PI / 180.0;
        const lambdaK = KAABA_LONG * Math.PI / 180.0;
        const phi = latitude * Math.PI / 180.0;
        const lambda = longitude * Math.PI / 180.0;

        const psi = 180.0 / Math.PI * Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
        );

        return Math.round(psi);
    };

    const handlePermission = async () => {
        // Check if DeviceOrientationEvent is supported (it's not on desktop browsers)
        if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
            setError("Compass not supported on this device. Please use a mobile device.");
            // Still get location for showing Qibla direction
            getLocation();
            return;
        }

        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === 'granted') {
                    setPermissionGranted(true);
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    setError("Permission to access device orientation was denied.");
                }
            } catch (e) {
                setError("Error requesting orientation permission.");
            }
        } else {
            // Non-iOS 13+ devices (Android, older iOS)
            setPermissionGranted(true);
            window.addEventListener('deviceorientation', handleOrientation);
        }

        getLocation();
    };

    const getLocation = () => {
        // Check localStorage for saved location first
        const savedLocation = localStorage.getItem('user-location');
        if (savedLocation) {
            try {
                const parsed = JSON.parse(savedLocation);
                if (parsed.lat && parsed.lng) {
                    const qibla = calculateQibla(parsed.lat, parsed.lng);
                    setQiblaDate(qibla);
                    return;
                }
            } catch (e) {
                console.warn("Failed to parse saved location");
            }
        }

        // Get fresh location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const qibla = calculateQibla(position.coords.latitude, position.coords.longitude);
                    setQiblaDate(qibla);
                    // Save for future use
                    localStorage.setItem('user-location', JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }));
                },
                (err) => {
                    // Default to Erbil
                    const qibla = calculateQibla(36.1901, 44.0091);
                    setQiblaDate(qibla);
                    toast({
                        title: "Location Error",
                        description: "Using default location (Erbil) for Qibla calculation.",
                        variant: "destructive"
                    });
                }
            );
        } else {
            // Fallback to default
            const qibla = calculateQibla(36.1901, 44.0091);
            setQiblaDate(qibla);
        }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
        // webkitCompassHeading is for iOS
        const compass = (event as any).webkitCompassHeading || Math.abs(event.alpha! - 360);
        setHeading(compass);
    };

    useEffect(() => {
        // Cleanup
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const isPointingToQibla = Math.abs(heading - qiblaDate) < 10; // 10 degree tolerance

    return (
        <Card className="w-full max-w-md mx-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-xl border-none">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-600 dark:text-amber-500">
                    <Compass className="w-8 h-8" />
                    Qibla Compass
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                {!permissionGranted ? (
                    <div className="text-center space-y-4">
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Please allow access to device orientation to use the compass.
                        </p>
                        <Button
                            onClick={handlePermission}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Start Compass
                        </Button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                ) : (
                    <>
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Compass Rose */}
                            <div
                                className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700 shadow-inner"
                                style={{
                                    transform: `rotate(${-heading}deg)`,
                                    transition: 'transform 0.5s ease-out'
                                }}
                            >
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl font-bold text-zinc-400">N</div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl font-bold text-zinc-400">S</div>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-400">W</div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-400">E</div>

                                {/* Qibla Indicator (Kaaba Icon or Arrow) */}
                                <div
                                    className="absolute top-1/2 left-1/2 w-1 h-32 bg-transparent origin-bottom"
                                    style={{
                                        transform: `translate(-50%, -100%) rotate(${qiblaDate}deg)`,
                                    }}
                                >
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Needle (Your Phone) */}
                            <div className="absolute w-4 h-4 bg-red-500 rounded-full z-10 shadow-md ring-4 ring-white dark:ring-zinc-800" />
                            <div className="absolute w-1 h-16 bg-red-500 -mt-16 rounded-t-full origin-bottom z-0" />
                        </div>

                        <div className="text-center space-y-1">
                            <p className="text-3xl font-bold font-mono text-zinc-800 dark:text-zinc-100">
                                {Math.round(heading)}°
                            </p>
                            <p className="text-sm text-zinc-500 flex items-center justify-center gap-1">
                                Qibla Direction: {qiblaDate}°
                            </p>
                            {isPointingToQibla && (
                                <div className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold animate-bounce">
                                    You are facing Qibla! 🕋
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default QiblaCompass;
