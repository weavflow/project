import styles from "./moveButton.module.css"

export default function MoveButton({direction, offset, onClick}) {
    const label = direction === "Prev" ? "<" : ">";
    const className = direction === "Prev" ? styles.prev : styles.next;
    const style = direction === "Prev" ? {left : offset} : {right: offset};

    return (
        <button
            className={className}
            style={style}
            onClick={onClick}
        >{label}</button>
    )
}