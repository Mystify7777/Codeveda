import styles from './LeftPanel.module.css';

function LeftPanel({ recentSearches, onSearchClick, activeCity }) {
    return (
        <aside className={styles.leftPanel}>
            <h2>Recent</h2>
            <ul className={styles.searchList}>
                {recentSearches.length > 0 ? (
                    recentSearches.map((city) => (
                        <li key={city}>
                            <button 
                                className={`${styles.cityButton} ${city.toLowerCase() === activeCity.toLowerCase() ? styles.active : ''}`}
                                onClick={() => onSearchClick(city)}
                            >
                                {city}
                            </button>
                        </li>
                    ))
                ) : (
                    <p className={styles.noRecent}>No recent searches.</p>
                )}
            </ul>
        </aside>
    );
}
export default LeftPanel;