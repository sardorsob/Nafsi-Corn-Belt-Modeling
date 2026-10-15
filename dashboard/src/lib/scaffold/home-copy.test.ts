import { describe, expect, it } from "vitest";

import { homeCopy } from "./home-copy";

describe("homeCopy", () => {
  it("names the Nafsi2026 dashboard and the four research lanes", () => {
    expect(homeCopy.title).toBe("Nafsi2026 Interactive Dashboard");
    expect(homeCopy.lanes).toEqual([
      "Phenology",
      "Rotation",
      "Extremes",
      "Prediction"
    ]);
  });
});
