import type { Coordinates, QiblaResult } from "./types.js";

/** Kaaba coordinates in Mecca */
export const KAABA_COORDINATES: Coordinates = {
  lat: 21.4225,
  lng: 39.8262,
};

/**
 * Calculate Qibla direction (bearing in degrees from North, 0-360)
 * from any latitude/longitude to the Kaaba.
 */
export function calculateQibla(latitude: number, longitude: number): number {
  const phiK = (KAABA_COORDINATES.lat * Math.PI) / 180;
  const lambdaK = (KAABA_COORDINATES.lng * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;
  const lambda = (longitude * Math.PI) / 180;

  const psi =
    (180 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );

  return Math.round((psi + 360) % 360);
}

/** Get full Qibla result with direction and coordinates */
export function getQibla(from: Coordinates): QiblaResult {
  return {
    direction: calculateQibla(from.lat, from.lng),
    kaaba: KAABA_COORDINATES,
    from,
  };
}

/** Check if a compass heading is pointing toward Qibla (within tolerance degrees) */
export function isFacingQibla(
  heading: number,
  latitude: number,
  longitude: number,
  tolerance = 10
): boolean {
  const qibla = calculateQibla(latitude, longitude);
  const diff = Math.abs(((heading - qibla + 180) % 360) - 180);
  return diff <= tolerance;
}

/** Get distance to Kaaba in kilometers (Haversine formula) */
export function getDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371;
  const dLat = ((KAABA_COORDINATES.lat - latitude) * Math.PI) / 180;
  const dLng = ((KAABA_COORDINATES.lng - longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((latitude * Math.PI) / 180) *
      Math.cos((KAABA_COORDINATES.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/** Get Kaaba coordinates */
export function getKaabaCoordinates(): Coordinates {
  return KAABA_COORDINATES;
}
