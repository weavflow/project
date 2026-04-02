import styles from "./header.module.css";
import {useState} from "react";
import SideBar from "../sideBar/sideBar.jsx";
import NavBar from "../navBar/navBar.jsx";

// Header
// 상단바와 사이드바 통합
export default function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function handleTabClick() {
        setIsSidebarOpen(prev => !prev);
    }

    return (
        <>
            <header className={`${styles.header} ${isSidebarOpen ? styles.active : ""}`}>
                <NavBar active={isSidebarOpen} onToggle={handleTabClick}/>
            </header>

            <SideBar active={isSidebarOpen} state={setIsSidebarOpen}/>

            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.active : ""}`}
                onClick={handleTabClick}
            />
        </>
    )
}