function WeatherDisplay({ data }) {
  if (!data) return null;

  const { name, sys, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="weather-display">
      <h2>{name}, {sys.country}</h2>
      <div className="weather-main">
        <img src={iconUrl} alt={weather[0].description} />
        <p className="temperature">{Math.round(main.temp)}°C</p>
      </div>
      <p className="weather-description">{weather[0].description}</p>
      <div className="weather-details">
        <div>
          <p>Humidity</p>
          <p className="detail-value">{main.humidity}%</p>
        </div>
        <div>
          <p>Wind Speed</p>
          <p className="detail-value">{wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;