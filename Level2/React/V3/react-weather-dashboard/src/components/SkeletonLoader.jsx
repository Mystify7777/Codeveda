import styles from './SkeletonLoader.module.css';

function SkeletonLoader({ type }) {
    if (type === 'center') {
        return (
            <div className={`${styles.skeleton} ${styles.centerPanelSkeleton}`}>
                <div className={`${styles.pulse} ${styles.line}`} style={{width: '60%', height: '2rem'}}></div>
                <div className={`${styles.pulse} ${styles.circle}`} style={{width: '120px', height: '120px'}}></div>
                <div className={`${styles.pulse} ${styles.line}`} style={{width: '30%', height: '4rem'}}></div>
                <div className={`${styles.pulse} ${styles.line}`} style={{width: '50%', height: '1.25rem'}}></div>
            </div>
        );
    }
    
    if (type === 'right') {
        return (
            <div className={`${styles.skeleton} ${styles.rightPanelSkeleton}`}>
                <div className={`${styles.pulse} ${styles.line}`} style={{width: '80%', height: '1.5rem'}}></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`${styles.pulse} ${styles.line}`} style={{height: '2rem', marginTop: '1rem'}}></div>
                ))}
            </div>
        );
    }
    return null;
}
export default SkeletonLoader;