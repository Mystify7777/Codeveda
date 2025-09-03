import React, { useState, useEffect } from "react";
import WeatherCard from "./components/WeatherCard";
import HistoryList from "./components/HistoryList";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric"); // metric = °C, imperial = °F
  const [history, setHistory] = useState([]);

  const API_KEY = "8935de291ab12b456e28e6ed64540e27"; // Replace with your OpenWeatherMap API key

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(savedHistory);
  }, []);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        alert("City not found!");
        return;
      }
      setWeather(data);

      const newHistory = [cityName, ...history.filter((c) => c !== cityName)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  const handleSearch = () => {
    fetchWeather(city);
    setCity("");
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
    if (weather) {
      fetchWeather(weather.name);
    }
  };

  return (
    <div className="App">
      <h1>🌍 Advanced Weather App</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button className="unit-toggle" onClick={toggleUnit}>
          {unit === "metric" ? "°F → °C" : "°C → °F"}
        </button>
      </div>

      {history.length > 0 && (
        <>
          <h3>Recent Searches:</h3>
          <HistoryList cities={history} onSelect={fetchWeather} />
        </>
      )}

      {weather && <WeatherCard weather={weather} unit={unit} />}
    </div>
  );
}

export default App;
