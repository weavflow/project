import {Link} from "react-router-dom"
import styles from "./navBar.module.css";

// 상단바 + 사이드바 버튼
export default function NavBar({active, onToggle}) {
    return (
        <>
            <nav className={`${styles.hd__nav} ${active? styles.hidden : ""}`}>
                <Link to="/">홈</Link>
                <Link to={"/add"}>추가</Link>
                <Link to={"/status"}>체크</Link>
            </nav>

            <button
                className={`${styles.hd__sidebar__btn} ${active? styles.active : ""}`}
                onClick={onToggle}
            >
                {active? "⩥" : "⩤"}
            </button>
        </>
    )
}