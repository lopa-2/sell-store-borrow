export async function fetchWeatherForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,relative_humidity_2m_mean&forecast_days=7&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();

  return data.daily.time.map((date, i) => ({
    day: i + 1,
    date,
    tempC: data.daily.temperature_2m_max[i],
    humidity: data.daily.relative_humidity_2m_mean[i],
  }));
}

export const locationOptions = [
  { name: "Indore, MP", lat: 22.7196, lon: 75.8577 },
  { name: "Nashik, MH", lat: 19.9975, lon: 73.7898 },
  { name: "Ludhiana, PB", lat: 30.901, lon: 75.8573 },
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
];