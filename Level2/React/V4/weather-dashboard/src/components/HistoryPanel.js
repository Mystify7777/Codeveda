export default function HistoryPanel({ cities, active, onSelect }) {
  if (!cities?.length) return (
    <div className="meta">Your 5 most recent cities will appear here.</div>
  );

  return (
    <div className="chips" aria-label="Recent searches">
      {cities.map((city) => (
        <button
          key={city}
          className={`chip ${city === active ? "active" : ""}`}
          onClick={() => onSelect(city)}
          aria-pressed={city === active}
          aria-label={`Load weather for ${city}`}
        >
          <span>{city}</span>
        </button>
      ))}
    </div>
  );
}
