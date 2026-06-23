import { describe, it, expect } from "vitest";
import { setupImanikurd, isImanikurdConfigured } from "../index";

describe("imanikurd-react-native", () => {
  it("configures the data loader", () => {
    setupImanikurd({ "test.json": { ok: true } });
    expect(isImanikurdConfigured()).toBe(true);
  });
});
