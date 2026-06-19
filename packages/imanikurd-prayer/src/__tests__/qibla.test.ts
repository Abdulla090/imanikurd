import { describe, it, expect } from "vitest";
import { calculateQibla, getDistanceToKaaba, isFacingQibla, getQibla } from "../qibla.js";

describe("Qibla calculations", () => {
  it("should calculate correct Qibla angle from Erbil", () => {
    // Erbil coordinates: lat: 36.1912, lng: 44.0094
    const angle = calculateQibla(36.1912, 44.0094);
    // Erbil Qibla is 195 degrees (South-South-West)
    expect(angle).toBe(195);
  });

  it("should calculate correct distance from Erbil to Kaaba", () => {
    const dist = getDistanceToKaaba(36.1912, 44.0094);
    // Erbil to Mecca is approx 1692 km
    expect(dist).toBe(1692);
  });

  it("should correctly identify if facing Qibla within tolerance", () => {
    // Erbil Qibla is 195 degrees
    const heading1 = 195;
    expect(isFacingQibla(heading1, 36.1912, 44.0094, 5)).toBe(true);

    const heading2 = 90; // Facing East
    expect(isFacingQibla(heading2, 36.1912, 44.0094, 5)).toBe(false);
  });

  it("should return detailed qibla info", () => {
    const info = getQibla({ lat: 36.1912, lng: 44.0094 });
    expect(info.direction).toBe(195);
    expect(info.kaaba.lat).toBe(21.4225);
    expect(info.kaaba.lng).toBe(39.8262);
  });
});
