import "./header.css"

export default function Header({active, onToggle}) {
    return (
        <header className={`header ${active ? "active" : ""}`}>
            <nav className={`hd__nav ${active ? "hidden" : ""}`}>
                <a href={"/"}>추가</a>
                <a href={"/"}>체크</a>
            </nav>

            <button
                className={`hd__sidebar__btn`}
                onClick={onToggle}
            >
                {active? "⩥" : "⩤"}
            </button>
        </header>
    )
}