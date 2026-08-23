import { useState, useEffect } from "react";
import { getOptions, getRecommendation, getAllRecommendations } from "./api";
import { speakRecommendation } from "./voice";
import { getSavedListings, saveListing, deleteListing } from "./savedListings";
import PriceChart from "./PriceChart";
import "./App.css";

const cropEmoji = { wheat: "🌾", onion: "🧅", tomato: "🍅", potato: "🥔" };

export default function App() {
  const [options, setOptions] = useState(null);
  const [crop, setCrop] = useState("onion");
  const [quantity, setQuantity] = useState(10);
  const [locationName, setLocationName] = useState("Indore, MP");
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState([]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    getOptions()
      .then((opts) => {
        setOptions(opts);
        setCrop(opts.crops[0]);
        setLocationName(opts.locations[0].name);
      })
      .catch(() => setError("Couldn't reach the server. It may still be waking up — try again shortly."));
    setSaved(getSavedListings());
  }, []);

  useEffect(() => {
    if (!crop || !locationName) return;
    setLoading(true);
    setError(null);
    getRecommendation(crop, quantity, locationName)
      .then(setData)
      .catch(() => setError("Couldn't load this entry. The server may be waking up — try again shortly."))
      .finally(() => setLoading(false));
  }, [crop, quantity, locationName]);

  useEffect(() => {
    if (!options || !locationName) return;
    getAllRecommendations(options.crops, quantity, locationName)
      .then(setAllData)
      .catch(() => {});
  }, [options, quantity, locationName]);

  function handleSave() {
    if (!data) return;
    const entry = saveListing({
      crop,
      quantity,
      location: locationName,
      pricePerQuintal: data.recommendation.trend.currentPrice,
      action: data.recommendation.action,
      headline: data.recommendation.headline,
      loanAmount: data.loanOffer.loanAmount,
      totalCropValue: data.loanOffer.totalCropValue,
      spoilageDays: data.spoilageRisk.daysRemaining,
    });
    setSaved((prev) => [entry, ...prev].slice(0, 20));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  function handleDelete(id) {
    setSaved(deleteListing(id));
  }

  if (!options) {
    return (
      <div className="app">
        <div className="loading-screen">
          <p>Opening the ledger…</p>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Harvest Decision Ledger — Kharif Season</p>
        <h1>Sell, Store, <em>or</em> Borrow</h1>
        <p className="hero-sub">
          Every harvest, farmers sell at the season's lowest price because cash can't wait.
          This ledger checks the market, the weather, and a warehouse loan — before you decide.
        </p>
      </header>

      <section className="ticker">
        <div className="ticker-item">
          <span className="ticker-num">70–80%</span>
          <span className="ticker-label">of crop value released as loan</span>
        </div>
        <div className="ticker-div" />
        <div className="ticker-item">
          <span className="ticker-num">20–35%</span>
          <span className="ticker-label">more revenue by waiting to sell</span>
        </div>
        <div className="ticker-div" />
        <div className="ticker-item">
          <span className="ticker-num">48 hrs</span>
          <span className="ticker-label">from deposit to loan in hand</span>
        </div>
      </section>

      <section className="ledger-form">
        <div className="field">
          <label>Crop</label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)}>
            {options.crops.map((c) => (
              <option key={c} value={c}>{cropEmoji[c] || ""} {c[0].toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Quantity, quintals</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <div className="field">
          <label>Nearest mandi</label>
          <select value={locationName} onChange={(e) => setLocationName(e.target.value)}>
            {options.locations.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
        </div>
      </section>

      {loading && (
        <div className="skeleton-row">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      )}
      {error && <p className="error">{error}</p>}

      {data && !loading && (
        <>
          <section className="lots">
            <article className={`lot ${data.recommendation.action === "SELL_NOW" ? "clay" : "moss"}`}>
              <div className="lot-tab">01</div>
              <div className="lot-body">
                <span className="lot-label">Sell or store</span>
                <h2>{data.recommendation.headline}</h2>
                <p>{data.recommendation.reason}</p>
                <div className="lot-foot">
                  <span className="reading">
                    {data.recommendation.trend.direction === "rising" ? "↑" : data.recommendation.trend.direction === "falling" ? "↓" : "→"}
                    {" "}{Math.abs(data.recommendation.trend.changePercent)}% over 10 days
                  </span>
                  <button className="listen" onClick={() => speakRecommendation(data)}>▶ Listen</button>
                </div>
              </div>
            </article>

            <article className={`lot risk-${data.spoilageRisk.riskLevel}`}>
              <div className="lot-tab">02</div>
              <div className="lot-body">
                <span className="lot-label">Spoilage watch</span>
                <h2>{data.spoilageRisk.daysRemaining} days safe to store</h2>
                <p>Risk level: <strong>{data.spoilageRisk.riskLevel}</strong>, based on the coming week's weather.</p>
                <div className="lot-foot">
                  <span className="reading">{data.spoilageRisk.avgTemp}°C avg · {data.spoilageRisk.avgHumidity}% humidity</span>
                </div>
              </div>
            </article>

            <article className="lot receipt">
              <div className="lot-tab">03</div>
              <div className="lot-body">
                <span className="lot-label">Borrow against harvest</span>
                <h2>₹{data.loanOffer.loanAmount.toLocaleString("en-IN")}</h2>
                <p>
                  {data.loanOffer.ltvPercent}% of your ₹{data.loanOffer.totalCropValue.toLocaleString("en-IN")} crop value
                  {" "}({quantity} quintals × ₹{data.recommendation.trend.currentPrice}/quintal), held as an e-NWR warehouse receipt.
                </p>
                <div className="perforation" />
                <div className="lot-foot receipt-foot">
                  <span>Interest <strong>{data.loanOffer.annualInterestRate}% p.a.</strong></span>
                  <span>Disbursed in <strong>{data.loanOffer.disbursalHours}h</strong></span>
                </div>
                <button className="save-btn" onClick={handleSave}>
                  {justSaved ? "✓ Saved to ledger" : "Save this listing"}
                </button>
              </div>
            </article>
          </section>

          <PriceChart priceHistory={data.priceHistory} crop={crop} />
        </>
      )}

      {allData && (
        <section className="ledger-table">
          <h3>Every crop, side by side</h3>
          <table>
            <thead>
              <tr><th>Crop</th><th>Price / quintal</th><th>Call</th><th>Spoilage</th><th>Loan on {quantity}q</th></tr>
            </thead>
            <tbody>
              {allData.map((d) => (
                <tr key={d.crop} className={d.crop === crop ? "active" : ""}>
                  <td>{cropEmoji[d.crop]} {d.crop}</td>
                  <td className="mono">₹{d.recommendation.trend.currentPrice}</td>
                  <td><span className={`tag ${d.recommendation.action === "SELL_NOW" ? "clay" : "moss"}`}>{d.recommendation.action === "SELL_NOW" ? "Sell" : "Store"}</span></td>
                  <td>{d.spoilageRisk.riskLevel}</td>
                  <td className="mono">₹{d.loanOffer.loanAmount.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {saved.length > 0 && (
        <section className="ledger-table saved-listings">
          <h3>Saved listings</h3>
          <table>
            <thead>
              <tr><th>Crop</th><th>Qty</th><th>Mandi</th><th>Call</th><th>Loan</th><th></th></tr>
            </thead>
            <tbody>
              {saved.map((s) => (
                <tr key={s.id}>
                  <td>{cropEmoji[s.crop]} {s.crop}</td>
                  <td className="mono">{s.quantity}q</td>
                  <td>{s.location}</td>
                  <td><span className={`tag ${s.action === "SELL_NOW" ? "clay" : "moss"}`}>{s.action === "SELL_NOW" ? "Sell" : "Store"}</span></td>
                  <td className="mono">₹{s.loanAmount.toLocaleString("en-IN")}</td>
                  <td><button className="remove-btn" onClick={() => handleDelete(s.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <footer>
        <p>Built for smallholder farmers who need cash without selling at a loss.</p>
        {data && (
          <p className="stub">
            Price feed: {data.pricesAreLive ? "live · Agmarknet" : "cached, recent"} — Weather feed: {data.weatherIsLive ? "live" : "cached"}
          </p>
        )}
      </footer>
    </div>
  );
}