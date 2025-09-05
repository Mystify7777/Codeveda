import Skeleton from "./Skeleton";

export default function ForecastPanel({ daily, loading, unit }) {
  return (
    <div className="panel">
      <div className="header"><div className="title">Next 5 Days</div></div>

      {loading ? (
        <div className="forecast-grid" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={110} />
          ))}
        </div>
      ) : (
        <div className="forecast-grid">
          {daily.map((d) => (
            <div key={d.date} className="forecast-card" role="article">
              <div className="meta" style={{ marginBottom: 4 }}>
                {new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              </div>
              <img
                loading="lazy"
                width="64" height="64"
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt={d.desc}
              />
              <div style={{ marginTop: 6 }}>
                <strong>{Math.round(d.tMax)}°</strong>
                <span className="meta"> / {Math.round(d.tMin)}°</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
