import { useEffect, useMemo, useState } from "react";
import "./index.css";
import "./App.css";
import SearchBar from "./components/SearchBar";
import HistoryPanel from "./components/HistoryPanel";
import CurrentPanel from "./components/CurrentPanel";
import ForecastPanel from "./components/ForecastPanel";
import { toDaily } from "./utils/forecast";

const API = {
  currentByCity: (q, unit, key) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=${unit}&appid=${key}`,
  currentByCoords: (lat, lon, unit, key) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${key}`,
  forecastByCoords: (lat, lon, unit, key) =>
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${key}`,
  forecastByCity: (q, unit, key) =>
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&units=${unit}&appid=${key}`,
};

const KEY = process.env.REACT_APP_OPENWEATHER_KEY;

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [unit, setUnit] = useState(() => localStorage.getItem("unit") || "metric");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("history") || "[]"));
  const [activeCity, setActiveCity] = useState(history[0] || "");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState("");

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("unit", unit);
  }, [unit]);

  // On mount: try geolocation → load current & forecast
  useEffect(() => {
    let didCancel = false;

    async function loadByCoords(lat, lon) {
      try {
        setLoadingCurrent(true);
        setLoadingForecast(true);
        const [cRes, fRes] = await Promise.all([
          fetch(API.currentByCoords(lat, lon, unit, KEY)),
          fetch(API.forecastByCoords(lat, lon, unit, KEY)),
        ]);
        const cData = await cRes.json();
        const fData = await fRes.json();
        if (!didCancel) {
          if (cData.cod !== 200) throw new Error(cData.message || "Failed current");
          if (fData.cod !== "200") throw new Error(fData.message || "Failed forecast");
          setCurrent(cData);
          setForecast(toDaily(fData.list));
          setActiveCity(cData.name);
          setError("");
        }
      } catch (e) {
        if (!didCancel) setError(e.message || "Could not load weather");
      } finally {
        if (!didCancel) { setLoadingCurrent(false); setLoadingForecast(false); }
      }
    }

    function fallback() {
      // Try last city from history, else a sane default
      const seed = history[0] || "London";
      onSearch(seed);
    }

    if (!KEY) {
      setError("Missing API key. Add REACT_APP_OPENWEATHER_KEY to your .env and restart.");
      fallback();
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fallback(),
        { timeout: 6000 }
      );
    } else {
      fallback();
    }

    return () => { didCancel = true; };
    // eslint-disable-next-line
  }, [unit]); // refetch when unit changes

  // Search by city name from SearchBar or History
  async function onSearch(city) {
    try {
      setLoadingCurrent(true);
      setLoadingForecast(true);
      setActiveCity(city);
      const cRes = await fetch(API.currentByCity(city, unit, KEY));
      const cData = await cRes.json();
      if (cData.cod !== 200) throw new Error(cData.message || "City not found");
      const { coord } = cData;

      const fRes = await fetch(API.forecastByCoords(coord.lat, coord.lon, unit, KEY));
      const fData = await fRes.json();
      if (fData.cod !== "200") throw new Error(fData.message || "Forecast unavailable");

      setCurrent(cData);
      setForecast(toDaily(fData.list));
      setError("");

      // Save history (unique, 5 max)
      const next = [city, ...history.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
      setHistory(next);
      localStorage.setItem("history", JSON.stringify(next));
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoadingCurrent(false);
      setLoadingForecast(false);
    }
  }

  const daily = useMemo(() => forecast, [forecast]);

  return (
    <div className="app-shell">
      {/* LEFT: History */}
      <aside className="panel" aria-label="Recent Searches">
        <div className="header">
          <div className="title">Recent</div>
        </div>
        <HistoryPanel
          cities={history}
          active={activeCity}
          onSelect={onSearch}
        />
      </aside>

      {/* CENTER: Current + search + theme/unit */}
      <main className="panel current" aria-live="polite">
        <div className="header">
          <div className="title">Weather Dashboard</div>
          <div className="spacer" />
        </div>

        <SearchBar
          onSearch={onSearch}
          unit={unit}
          onToggleUnit={() => setUnit((u) => (u === "metric" ? "imperial" : "metric"))}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        />

        {error && (
          <div className="panel" style={{ padding: 12, marginBottom: 12, borderStyle: "dashed" }} role="alert">
            {error}
          </div>
        )}

        <CurrentPanel data={current} loading={loadingCurrent} unit={unit} />
      </main>

      {/* RIGHT: 5-day Forecast */}
      <aside className="panel" aria-label="5 Day Forecast">
        <ForecastPanel daily={daily} loading={loadingForecast} unit={unit} />
      </aside>
    </div>
  );
}
