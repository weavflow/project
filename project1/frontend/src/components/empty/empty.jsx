import styles from "./empty.module.css";

export default function Empty({title, onReset}) {
    return (
        <div className={styles.td__empt}>
            <p>"{title}" 에 대한 결과가 없습니다.</p>
            <button onClick={onReset} className={styles.td__empt__btn}>
                전체 목록 보기
            </button>
        </div>
    )
}