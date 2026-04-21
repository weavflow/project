"use client"

import styles from "./topEnd.module.css";
import Link from "next/link";
import {useState, useRef, useEffect} from "react";

export default function TopEnd() {
    const [isClicked, setIsClicked] = useState(false);
    const dropdownRef = useRef(null);

    const handleClick = (e) => {
        e.stopPropagation();
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


    return (
        <div className={styles.shop__header__topEnd}>
            <div className={styles.shop__header__topEnd__container}>
                <nav className={styles.topEnd__nav}>
                    <div className={styles.topEnd__nav__right}>
                        <Link href={"/"}>WeavFlow</Link>
                        <Link href={"/"}>스토어</Link>
                    </div>

                    <div
                        ref={dropdownRef}
                        className={styles.topEnd__nav__left}>
                        <button className={styles.topEnd__login__btn}>로그인</button>
                        <p
                            className={styles.topEnd__nav__icon}
                            onClick={handleClick}
                        >icon</p>
                        {isClicked && <div className={styles.icon__list}>
                            임시 메뉴
                        </div>}
                    </div>
                </nav>
            </div>
        </div>
    )
}