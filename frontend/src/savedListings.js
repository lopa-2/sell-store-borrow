const KEY = "ssb_saved_listings";
const MAX_SAVED = 20;

export function getSavedListings() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveListing(entry) {
  const listings = getSavedListings();
  const withId = { ...entry, id: Date.now(), savedAt: new Date().toISOString() };
  listings.unshift(withId);
  localStorage.setItem(KEY, JSON.stringify(listings.slice(0, MAX_SAVED)));
  return withId;
}

export function deleteListing(id) {
  const listings = getSavedListings().filter((l) => l.id !== id);
  localStorage.setItem(KEY, JSON.stringify(listings));
  return listings;
}