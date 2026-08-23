export function calculateSpoilageRisk(cropProfile, weatherForecast) {
  const avgTemp = weatherForecast.reduce((s, d) => s + d.tempC, 0) / weatherForecast.length;
  const avgHumidity = weatherForecast.reduce((s, d) => s + d.humidity, 0) / weatherForecast.length;

  const tempDeviation = Math.abs(avgTemp - cropProfile.idealTempC);
  const humidityDeviation = Math.abs(avgHumidity - cropProfile.idealHumidity);

  const tempPenalty = (tempDeviation / 5) * 0.15;
  const humidityPenalty = (humidityDeviation / 10) * 0.08;
  const totalPenalty = Math.min(tempPenalty + humidityPenalty, 0.9);

  const daysRemaining = Math.max(Math.round(cropProfile.baseShelfLifeDays * (1 - totalPenalty)), 0);

  let riskLevel = "low";
  if (cropProfile.perishable && daysRemaining < 10) riskLevel = "high";
  else if (cropProfile.perishable && daysRemaining < 25) riskLevel = "medium";
  else if (!cropProfile.perishable && daysRemaining < 60) riskLevel = "medium";

  return {
    daysRemaining,
    riskLevel,
    avgTemp: Number(avgTemp.toFixed(1)),
    avgHumidity: Number(avgHumidity.toFixed(1)),
  };
}