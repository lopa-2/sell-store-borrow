const BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

export async function fetchMandiPrices(commodity, state) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) throw new Error("No Mandi API key configured");

  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: "10",
    "filters[commodity]": commodity,
    "filters[state]": state,
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error("Mandi price fetch failed");
  const data = await res.json();

  if (!data.records || data.records.length === 0) {
    throw new Error("No records for this commodity/state combination");
  }

  return data.records
    .map((r) => Number(r.modal_price))
    .filter((p) => !Number.isNaN(p))
    .reverse();
}