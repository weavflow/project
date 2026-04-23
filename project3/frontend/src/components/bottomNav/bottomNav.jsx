"use client"
import styles from "./bottomNav.module.css";
import LoadData from "@/lib/loadData";
import {useState, useEffect} from "react";
import {NavItem} from "@/components/bottomNav/navItem/navItem";

export default function BottomNav({theme}) {
    const [navList, setNavList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        LoadData(setNavList, setError, "nav");
    }, []);

    useEffect(() => {
        console.log(navList);
        console.log(navList.map((item) => item.children));
    }, [navList])

    if (error) return <>{error.message}</>;

    return (
        <nav
            className={styles.shop__bottom__nav}
            style={{
                color: theme.text
            }}
        >
            <ul className={styles.bottom__nav__list}>
                {navList.map((item, index) => (
                    <NavItem key={index} item={item} />
                ))}
            </ul>

        </nav>
    )
}