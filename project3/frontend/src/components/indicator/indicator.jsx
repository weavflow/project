import styles from './indicator.module.css';

export default function Indicator({data, current, onChange}) {
    return (
        <div className={styles.ad__indicator}>
            {data.map((item, index) => (
                <span
                    key={index}
                    className={`${styles.ad__dot} ${current === index ? styles.active: ""}`}
                    onClick={() => {onChange(index)}}
                />
            ))}
        </div>
    )
}