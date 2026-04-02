import styles from "./sideBar.module.css"
import {NavLink, useLocation} from "react-router-dom"
import {useEffect} from "react";

// 사이드바
export default function SideBar({active, state}) {
    const location = useLocation();

    // 링크 클릭 시 SideBar close
    useEffect(() => {
        state(false);
    }, [location]);

    // Esc 동작 시 SideBar close
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") {
                state(false);
            }
        }

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [])

    return (
        <nav>
            <aside className={`${styles.sidebar} ${active ? styles.active : ""}`}>
                <nav className={styles.sidebar__nav}>
                    <NavLink to={"/"}>홈</NavLink>
                    <NavLink to={"/add"}>추가</NavLink>
                    <NavLink to={"/status"}>체크</NavLink>
                </nav>
            </aside>
        </nav>
    )
}