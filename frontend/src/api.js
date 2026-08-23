const API_URL = import.meta.env.VITE_API_URL;

export async function getOptions() {
  const res = await fetch(`${API_URL}/api/options`);
  if (!res.ok) throw new Error("Failed to load options");
  return res.json();
}

export async function getRecommendation(crop, quantity, locationName) {
  const params = new URLSearchParams({ crop, quantity, locationName });
  const res = await fetch(`${API_URL}/api/recommend?${params}`);
  if (!res.ok) throw new Error("Failed to load recommendation");
  return res.json();
}

export async function getAllRecommendations(crops, quantity, locationName) {
  const results = await Promise.all(
    crops.map((crop) => getRecommendation(crop, quantity, locationName))
  );
  return results;
}