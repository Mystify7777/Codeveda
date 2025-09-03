import React from "react";
import "../styles/Weather.css";

function WeatherCard({ weather, unit }) {
  const { name, sys, main, weather: w, wind } = weather;
  const iconUrl = `https://openweathermap.org/img/wn/${w[0].icon}@2x.png`;

  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="weather-card">
      <h2>
        {name}, {sys.country}
      </h2>
      <img src={iconUrl} alt={w[0].description} className="weather-icon" />
      <div className="temp">
        {Math.round(main.temp)}°{unit === "metric" ? "C" : "F"}
      </div>
      <div className="desc">{w[0].description}</div>
      <p>Feels like: {Math.round(main.feels_like)}°</p>
      <p>
        Min: {Math.round(main.temp_min)}° | Max: {Math.round(main.temp_max)}°
      </p>
      <p>💧 Humidity: {main.humidity}%</p>
      <p>🌬 Wind: {wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>
      <p>🌅 Sunrise: {sunrise} | 🌇 Sunset: {sunset}</p>
    </div>
  );
}

export default WeatherCard;
