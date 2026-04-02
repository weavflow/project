import styles from "./error.module.css";

function Initial() {
    return (<div className={styles.td__initial}>Loading</div>);
}

function Error({message, onRetry}) {
    return (
        <div className={styles.td__error}>
            <p>🚨 문제가 발생했습니다.</p>
            <p>Error : {message}</p>
            <button onClick={onRetry}>다시 시도</button>
        </div>
    )
}

export {Initial, Error};