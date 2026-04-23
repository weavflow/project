"use client"
import styles from "./bottomNav.module.css";
import Link from "next/link"
import {useState, useRef, useEffect} from "react";

export default function BottomNav() {
    const [isClicked, setIsClicked] = useState(false);
    const dropdownRef = useRef(null);

    const handleClick = () => {
        setIsClicked(prev => !prev);
    }

    useEffect(() => {
        function handleKeyClick(e) {
            if (!dropdownRef.current) return;

            if (!dropdownRef.current.contains(e.target)) {
                setIsClicked(false);
            }
        }

        document.addEventListener("mousedown", handleKeyClick);

        return () => {
            document.removeEventListener("mousedown", handleKeyClick);
        }
    }, [])

    // Router 이동 시 dropdown 창 닫기

    return (
        <nav className={styles.shop__bottom__nav}>
            <ul className={styles.bottom__nav__list}>
                <li className={styles.bottom__nav__item}>
                    <span className={styles.nav__label}>
                        <Link href={"/shop/live"}>쇼핑</Link>
                    </span>
                </li>
                <li className={styles.bottom__nav__item}>
                    <span className={styles.nav__label}>
                        <Link href={"/shop/best"}>베스트</Link>
                    </span>
                </li>
                <li
                    ref={dropdownRef}
                    className={styles.bottom__nav__item}>
                    <span
                        className={styles.nav__label}
                        onClick={handleClick}>
                        전체▾
                    </span>
                    {/* Dropdown box */}
                    {isClicked && <div className={styles.bottom__dropdown}>
                        <ul className={styles.bottom__list}>
                            <li className={styles.bottom__list__item}>
                                <Link href={"/"}>리스트1</Link>
                            </li>

                            <li className={styles.bottom__list__item}>
                                <Link href={"/"}>리스트2</Link>
                            </li>
                        </ul>
                    </div>}
                </li>
                <li  className={styles.bottom__nav__item}>
                    <span className={styles.nav__label}>
                    <Link href={"/"}>장바구니</Link>
                    </span>
                </li>
            </ul>
        </nav>
    )
}