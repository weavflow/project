import Link from "next/link";
import styles from "../bottomNav.module.css";
import {useState, useEffect, useRef } from "react";

export function NavItem({item}) {
    const [isClicked, setIsClicked] = useState(false);
    const dropdownRef = useRef(null);

    const hasChildren = Array.isArray(item.children);

    const handleClick = () => {
        setIsClicked(prev => !prev);
    }

    useEffect(() => {
        if (!hasChildren) return;

        function handleKeyClick(e) {
            if (!dropdownRef.current) return;

            if (!dropdownRef.current.contains(e.target)) {
                setIsClicked(false);
            }
        }

        document.addEventListener("mousedown", handleKeyClick);

        return () => document.removeEventListener("mousedown", handleKeyClick);
    }, [hasChildren]);

    // 일반 리스트
    function LinkItem() {
        if (!item.path) return null;

        return (
            <span className={styles.nav__label}>
                <Link href={item.path ?? "#"}>{item.label}</Link>
            </span>
        )
    }

    // Dropdown 리스트
    function DropdownItem() {
        return (
            <>
                <span
                    className={styles.nav__label}
                    onClick={handleClick}
                >
                    {item.label}▾
                </span>
                {isClicked && (
                    <div className={styles.bottom__dropdown}>
                        <ul className={styles.bottom__list}>
                            {item.children?.map((child, index) => (
                                <li
                                    key={index}
                                    className={styles.bottom__list__item}
                                >
                                    <Link href={child.path ?? "#"}>{child.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        )
    }

    if (!item.path && !hasChildren) return null;

    return (
        <li className={styles.bottom__nav__item} ref={dropdownRef}>
            {hasChildren ? <DropdownItem /> : <LinkItem />}
        </li>
    )
}