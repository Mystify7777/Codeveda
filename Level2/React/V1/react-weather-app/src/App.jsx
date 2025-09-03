import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay'; // Import new component
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null); // New state for forecast
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    // Geolocation logic remains the same...
    navigator.geolocation.getCurrentPosition(
      (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
      () => {
        setError("Geolocation denied. Please search for a city.");
        setLoading(false);
        setCity('Raniganj');
      }
    );
  }, []);

  useEffect(() => {
    if (!city) return;
    fetchAllWeather(city);
  }, [city]);

  const fetchAllWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData(null);

    try {
      // Use Promise.all to fetch both current weather and forecast concurrently
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found or API error.');
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setWeatherData(weatherData);
      setForecastData(forecastData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    // This function can also be updated to fetch forecast, but for simplicity
    // we will set the city name which triggers the main fetchAllWeather effect.
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    setCity(data.name);
  };


  return (
    <div className="app-container">
      <h1>Weather Dashboard</h1>
      <SearchBar onSearch={setCity} />

      {loading && <p className="loading-message">Fetching weather data...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Main content wrapper */}
      {weatherData && forecastData && (
        <div className="weather-content">
          <WeatherDisplay data={weatherData} />
          <ForecastDisplay data={forecastData} />
        </div>
      )}
    </div>
  );
}

export default App;