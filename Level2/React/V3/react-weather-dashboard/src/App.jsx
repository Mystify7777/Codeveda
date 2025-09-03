import { useState, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import ThemeToggle from './components/ThemeToggle';
import styles from './App.module.css'; // We'll create this file next

function App() {
    const [theme, setTheme] = useState('dark');
    const [city, setCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    // --- EFFECT HOOKS ---
    
    // Theme management effect
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // Load recent searches from localStorage on initial render
    useEffect(() => {
        const storedSearches = JSON.parse(localStorage.getItem('weatherAppSearches')) || [];
        setRecentSearches(storedSearches);

        // Geolocation logic
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => { // If geolocation fails or is denied
                const fallbackCity = storedSearches[0] || 'London';
                setCity(fallbackCity);
            }
        );
    }, []);

    // Fetch weather data whenever the city changes
    useEffect(() => {
        if (city) {
            fetchWeatherData(city);
        }
    }, [city]);


    // --- DATA FETCHING & STATE MANAGEMENT ---

    const fetchWeatherByCoords = async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            if (!response.ok) throw new Error('Could not fetch weather for your location.');
            const data = await response.json();
            setCity(data.name); // This will trigger the other useEffect to fetch all data
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchWeatherData = async (cityName) => {
        setLoading(true);
        setError(null);
        
        try {
            const [currentWeatherResponse, forecastResponse] = await Promise.all([
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`),
                fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
            ]);

            if (!currentWeatherResponse.ok || !forecastResponse.ok) {
                throw new Error('City not found. Please try again.');
            }
            
            const currentWeatherData = await currentWeatherResponse.json();
            const forecastData = await forecastResponse.json();

            setCurrentWeather(currentWeatherData);
            setForecast(forecastData);
            updateRecentSearches(cityName);

        } catch (err) {
            setError(err.message);
            setCurrentWeather(null);
            setForecast(null);
        } finally {
            setLoading(false);
        }
    };
    
    const updateRecentSearches = (newCity) => {
        const normalizedCity = newCity.trim().toLowerCase();
        const updatedSearches = [normalizedCity, ...recentSearches.filter(c => c.toLowerCase() !== normalizedCity)];
        const uniqueSearches = [...new Set(updatedSearches)].slice(0, 5);
        
        setRecentSearches(uniqueSearches);
        localStorage.setItem('weatherAppSearches', JSON.stringify(uniqueSearches));
    };

    const handleSearch = (searchCity) => {
        setCity(searchCity);
    };

    const handleRecentSearchClick = (searchCity) => {
        setCity(searchCity);
    };

    return (
        <div className={styles.dashboard}>
            <LeftPanel 
                recentSearches={recentSearches}
                onSearchClick={handleRecentSearchClick}
                activeCity={city}
            />
            <main className={styles.mainContent}>
                <header className={styles.mainHeader}>
                    <input
                        type="search"
                        placeholder="Search for a city..."
                        className={styles.searchBar}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch(e.target.value);
                        }}
                    />
                    <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
                </header>
                <CenterPanel 
                    loading={loading}
                    error={error}
                    weatherData={currentWeather}
                />
            </main>
            <RightPanel 
                loading={loading}
                forecastData={forecast}
            />
        </div>
    );
}

export default App;