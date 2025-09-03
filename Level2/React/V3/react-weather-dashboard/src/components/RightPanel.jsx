import SkeletonLoader from './SkeletonLoader';
import styles from './RightPanel.module.css';

function RightPanel({ loading, forecastData }) {
    if (loading) return <SkeletonLoader type="right" />;
    if (!forecastData) return null;

    const dailyForecasts = forecastData.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return (
        <aside className={`${styles.rightPanel} rightPanel`}>
            <h2>5-Day Forecast</h2>
            <ul className={styles.forecastList}>
                {dailyForecasts.map((item) => (
                    <li key={item.dt} className={styles.forecastItem}>
                        <p className={styles.day}>{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
                        <p className={styles.temp}>{Math.round(item.main.temp)}°</p>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
export default RightPanel;