function ForecastDisplay({ data }) {
  if (!data) return null;

  // OpenWeatherMap gives forecast data in 3-hour intervals. We need to
  // filter this to get one forecast per day. A simple way is to pick
  // the forecast for the midday time (e.g., 12:00:00).
  const dailyForecasts = data.list.filter(item => 
    item.dt_txt.includes("12:00:00")
  );

  return (
    <div className="forecast-display">
      <h3>5-Day Forecast</h3>
      <div className="forecast-items">
        {dailyForecasts.map((item) => (
          <div key={item.dt} className="forecast-item">
            <p className="forecast-day">
              {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt={item.weather[0].description}
            />
            <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastDisplay;