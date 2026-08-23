export const cropProfiles = {
  wheat: { baseShelfLifeDays: 180, idealTempC: 20, idealHumidity: 50, perishable: false },
  onion: { baseShelfLifeDays: 60, idealTempC: 15, idealHumidity: 65, perishable: true },
  tomato: { baseShelfLifeDays: 7, idealTempC: 13, idealHumidity: 90, perishable: true },
  potato: { baseShelfLifeDays: 90, idealTempC: 7, idealHumidity: 90, perishable: true },
};

// Fallback price history, used if the live Mandi API fails or isn't configured
export const mandiPriceHistoryMock = {
  wheat: [2180, 2150, 2120, 2100, 2080, 2075, 2090, 2110, 2140, 2130],
  onion: [1400, 1350, 1300, 1250, 1200, 1180, 1220, 1280, 1320, 1310],
  tomato: [1800, 1600, 1500, 1400, 1350, 1300, 1250, 1200, 1180, 1150],
  potato: [1100, 1080, 1050, 1020, 1000, 990, 1010, 1030, 1050, 1045],
};

// Fallback weather, used if the live weather API fails
export const weatherForecastMock = [
  { day: 1, tempC: 32, humidity: 65 },
  { day: 2, tempC: 34, humidity: 70 },
  { day: 3, tempC: 36, humidity: 75 },
  { day: 4, tempC: 33, humidity: 68 },
  { day: 5, tempC: 31, humidity: 60 },
  { day: 6, tempC: 30, humidity: 58 },
  { day: 7, tempC: 32, humidity: 62 },
];