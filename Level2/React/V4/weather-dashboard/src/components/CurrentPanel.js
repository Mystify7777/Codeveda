import Skeleton from "./Skeleton";

export default function CurrentPanel({ data, loading, unit }) {
  if (loading || !data) {
    return (
      <div className="panel current" aria-busy="true">
        <div className="header"><div className="title">Current</div></div>
        <div className="big">
          <Skeleton height={64} radius={12} style={{ width: 64 }} />
          <div style={{ width: "100%" }}>
            <Skeleton height={28} style={{ marginBottom: 8, width: "70%" }} />
            <Skeleton height={18} style={{ marginBottom: 6, width: "40%" }} />
            <Skeleton height={12} style={{ width: "50%" }} />
          </div>
        </div>
        <div className="grid" style={{ marginTop: 12 }}>
          <Skeleton height={54} />
          <Skeleton height={54} />
        </div>
      </div>
    );
  }

  const { name, sys, weather, main, wind } = data;
  const icon = weather?.[0]?.icon;
  const desc = weather?.[0]?.description;
  const unitLabel = unit === "metric" ? "m/s" : "mph";
  const temp = Math.round(main.temp);
  const feels = Math.round(main.feels_like);
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="panel current">
      <div className="header">
        <div className="title">Current</div>
      </div>

      <div className="big">
        <img
          width="64" height="64"
          loading="lazy"
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={desc}
        />
        <div>
          <div className="temp">{temp}°</div>
          <div className="meta">{name}, {sys.country} — {desc}</div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="panel" style={{ padding: 12 }}>
          <div><strong>Feels like:</strong> {feels}°</div>
          <div className="meta">Humidity: {main.humidity}%</div>
        </div>
        <div className="panel" style={{ padding: 12 }}>
          <div><strong>Wind:</strong> {wind.speed} {unitLabel}</div>
          <div className="meta">Pressure: {main.pressure} hPa</div>
        </div>
        <div className="panel" style={{ padding: 12 }}>
          <div><strong>Min:</strong> {Math.round(main.temp_min)}°</div>
          <div className="meta">Sunrise: {sunrise}</div>
        </div>
        <div className="panel" style={{ padding: 12 }}>
          <div><strong>Max:</strong> {Math.round(main.temp_max)}°</div>
          <div className="meta">Sunset: {sunset}</div>
        </div>
      </div>
    </div>
  );
}
