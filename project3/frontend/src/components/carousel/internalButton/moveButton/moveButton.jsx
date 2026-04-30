import styles from "./moveButton.module.css"

export default function MoveButton({direction, offset, onClick, color}) {
    const label = direction === "Prev" ? "<" : ">";
    const className = direction === "Prev" ? styles.prev : styles.next;
    const style = direction === "Prev"
        ? {left : offset, color: color}
        : {right: offset, color: color};

    return (
        <button
            className={className}
            style={style}
            onClick={onClick}
        >{label}</button>
    )
}