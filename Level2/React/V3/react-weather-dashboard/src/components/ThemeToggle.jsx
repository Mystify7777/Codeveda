import styles from './ThemeToggle.module.css';

function ThemeToggle({ theme, onToggle }) {
    return (
        <button onClick={onToggle} className={styles.toggleButton} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}
export default ThemeToggle;