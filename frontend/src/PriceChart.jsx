import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function PriceChart({ priceHistory, crop }) {
  const chartData = priceHistory.map((price, i) => ({ day: `D${i + 1}`, price }));
  return (
    <div className="ledger-table" style={{ marginBottom: "1.8rem" }}>
      <h3>10-day price entry — {crop}</h3>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbbf9e" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} />
          <YAxis tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} domain={["auto", "auto"]} />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Line type="monotone" dataKey="price" stroke="#c99a3e" strokeWidth={2.5} dot={{ r: 3, fill: "#1e2b22" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}