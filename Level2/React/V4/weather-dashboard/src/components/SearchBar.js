import { useState } from "react";

export default function SearchBar({
  onSearch,
  unit,
  onToggleUnit,
  theme,
  onToggleTheme
}) {
  const [q, setQ] = useState("");

  const submit = () => {
    const city = q.trim();
    if (city) { onSearch(city); setQ(""); }
  };

  return (
    <div className="search-row" role="search">
      <input
        className="input"
        aria-label="Search city"
        placeholder="Search city (e.g. Tokyo)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button className="btn" onClick={submit} aria-label="Search">
        Search
      </button>
      <button
        className="btn btn-outline toggle"
        onClick={onToggleUnit}
        aria-label="Toggle temperature unit"
        title="Toggle °C/°F"
      >
        {unit === "metric" ? "°C" : "°F"}
      </button>
      <button
        className="btn btn-outline toggle"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        title="Toggle dark/light"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
