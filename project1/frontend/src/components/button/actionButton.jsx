import styles from "./actionButton.module.css";

// 범용적 버튼
// 넘겨 받은 label에 따라 버튼 명과 className 변동
// 넘겨 받은 onClick에 따라서 버튼의 역할 변동
export default function ActionButton({
     label,
     onClick,
    variant = 'default'
}) {
    return (
        <button
            onClick={onClick}
            className={`${styles.td__btn} ${styles[variant]}`}>
            {label}
        </button>
    )
}