import SkeletonLoader from './SkeletonLoader';
import styles from './CenterPanel.module.css';

function CenterPanel({ loading, error, weatherData }) {
    if (loading) return <SkeletonLoader type="center" />;
    if (error) return <div className={`${styles.centerPanel} ${styles.error}`}>{error}</div>;
    if (!weatherData) return null;

    const { name, sys, main, weather, wind } = weatherData;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

    return (
        <div className={styles.centerPanel}>
            <p className={styles.location}>{name}, {sys.country}</p>
            <img src={iconUrl} alt={weather[0].description} className={styles.weatherIcon} />
            <p className={styles.temperature}>{Math.round(main.temp)}°</p>
            <p className={styles.description}>{weather[0].description}</p>
            <div className={styles.details}>
                <div>
                    <p>Humidity</p>
                    <p className={styles.detailValue}>{main.humidity}%</p>
                </div>
                <div>
                    <p>Wind Speed</p>
                    <p className={styles.detailValue}>{wind.speed} m/s</p>
                </div>
                <div>
                    <p>Feels Like</p>
                    <p className={styles.detailValue}>{Math.round(main.feels_like)}°</p>
                </div>
            </div>
        </div>
    );
}
export default CenterPanel;