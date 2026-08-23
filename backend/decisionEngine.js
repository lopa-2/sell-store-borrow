export function analyzePriceTrend(priceHistory) {
  const recent = priceHistory.slice(-5);
  const older = priceHistory.slice(0, 5);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

  let direction = "stable";
  if (changePercent > 2) direction = "rising";
  if (changePercent < -2) direction = "falling";

  return {
    changePercent: Number(changePercent.toFixed(1)),
    direction,
    currentPrice: priceHistory[priceHistory.length - 1],
  };
}

export function getSellOrStoreRecommendation(crop, priceHistory, spoilageRisk) {
  const trend = analyzePriceTrend(priceHistory);

  if (spoilageRisk.riskLevel === "high") {
    return {
      action: "SELL_NOW",
      headline: "Sell Now",
      reason: `${crop} has a high spoilage risk (${spoilageRisk.daysRemaining} safe days left). Waiting isn't worth the risk of losing the crop.`,
      trend,
    };
  }

  if (trend.direction === "rising") {
    return {
      action: "STORE",
      headline: `Store ${estimateWaitDays(trend)} Days — Prices Likely to Rise`,
      reason: `${crop} prices have risen ${Math.abs(trend.changePercent)}% recently, and storage is safe for ${spoilageRisk.daysRemaining} more days.`,
      trend,
    };
  }

  if (trend.direction === "falling" && spoilageRisk.riskLevel === "low") {
    return {
      action: "STORE",
      headline: "Store & Wait",
      reason: `Prices dipped ${Math.abs(trend.changePercent)}% but often rebound. Your crop is safe to store for ${spoilageRisk.daysRemaining} more days.`,
      trend,
    };
  }

  return {
    action: "SELL_NOW",
    headline: "Sell Now",
    reason: "Prices are stable and storage risk is moderate — little upside to waiting.",
    trend,
  };
}

function estimateWaitDays(trend) {
  if (trend.changePercent > 8) return 7;
  if (trend.changePercent > 4) return 4;
  return 2;
}