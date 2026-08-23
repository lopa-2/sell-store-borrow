import { describe, it, expect } from "vitest";
import { analyzePriceTrend, getSellOrStoreRecommendation } from "./decisionEngine.js";

describe("analyzePriceTrend", () => {
  it("detects a rising trend", () => {
    const trend = analyzePriceTrend([100, 102, 104, 108, 112, 115, 118, 120, 122, 125]);
    expect(trend.direction).toBe("rising");
  });

  it("detects a falling trend", () => {
    const trend = analyzePriceTrend([125, 122, 120, 118, 115, 112, 108, 104, 102, 100]);
    expect(trend.direction).toBe("falling");
  });
});

describe("getSellOrStoreRecommendation", () => {
  it("recommends selling when spoilage risk is high, even if price is rising", () => {
    const rec = getSellOrStoreRecommendation(
      "tomato",
      [100, 105, 110, 115, 120, 125, 130, 135, 140, 145],
      { riskLevel: "high", daysRemaining: 2 }
    );
    expect(rec.action).toBe("SELL_NOW");
  });
});