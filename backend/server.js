import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { cropProfiles, mandiPriceHistoryMock, weatherForecastMock } from "./cropProfiles.js";
import { getSellOrStoreRecommendation } from "./decisionEngine.js";
import { calculateSpoilageRisk } from "./spoilage.js";
import { calculateLoanOffer } from "./loan.js";
import { fetchWeatherForecast, locationOptions } from "./weatherApi.js";
import { fetchMandiPrices } from "./mandiApi.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check — useful to confirm the server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// List available crops and locations, for the frontend's dropdowns
app.get("/api/options", (req, res) => {
  res.json({
    crops: Object.keys(cropProfiles),
    locations: locationOptions,
  });
});

// Main endpoint: given a crop, quantity, and location, return the full recommendation
app.get("/api/recommend", async (req, res) => {
  try {
    const { crop, quantity, locationName } = req.query;

    const cropProfile = cropProfiles[crop];
    if (!cropProfile) {
      return res.status(400).json({ error: `Unknown crop: ${crop}` });
    }

    const qty = Number(quantity) || 1;
    const location = locationOptions.find((l) => l.name === locationName) || locationOptions[0];

    // Try live weather, fall back to mock on failure
    let weatherForecast;
    let weatherIsLive = true;
    try {
      weatherForecast = await fetchWeatherForecast(location.lat, location.lon);
    } catch {
      weatherForecast = weatherForecastMock;
      weatherIsLive = false;
    }

    // Try live Mandi prices, fall back to mock on failure
    let priceHistory;
    let pricesAreLive = true;
    try {
      priceHistory = await fetchMandiPrices(crop, "Madhya Pradesh");
      if (priceHistory.length < 5) throw new Error("Not enough data points");
    } catch {
      priceHistory = mandiPriceHistoryMock[crop];
      pricesAreLive = false;
    }

    const spoilageRisk = calculateSpoilageRisk(cropProfile, weatherForecast);
    const recommendation = getSellOrStoreRecommendation(crop, priceHistory, spoilageRisk);
    const loanOffer = calculateLoanOffer(qty, priceHistory.at(-1), cropProfile);

    res.json({
      crop,
      quantity: qty,
      location: location.name,
      weatherIsLive,
      pricesAreLive,
      priceHistory,
      spoilageRisk,
      recommendation,
      loanOffer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong generating the recommendation" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});