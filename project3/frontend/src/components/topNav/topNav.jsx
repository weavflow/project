"use client"

import styles from "./topNav.module.css";
import Link from "next/link";
import {useState, useRef, useEffect} from "react";

export default function TopNav() {
    // 좋아요 버튼
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);

    // 검색창 활성화 버튼
    const [isClicked, setIsClicked] = useState(false);

    // 검색어 fetch & error
    const [name, setName] = useState("");
    const [error, setError] = useState(null);

    // 입력된 값, 검색 결과, 표시 여부
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // 외부 클릭 시 검색창 닫기
    const dropdownRef = useRef(null);

    const handleLike = () => {
        // UI 변경
        setCount(prev => prev + 1);
        setLiked(true);
    }

    const handleClick = (e) => {
        e.stopPropagation();
        setIsClicked(prev => !prev);
    }

    const handleKeyDown = (e) => {
        setError(null);
        if (e.key !== 'Enter') return;
    }

    useEffect(() => {
        if (!query) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            fetch(`/api/shop/?search=${query}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data);
                    setIsOpen(true);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

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
        <nav className={styles.shop__top__nav}>
            <div className={styles.top__nav__follow}>
                <button
                    className={styles.top__nav__btn}
                    disabled={liked}
                    onClick={handleLike}
                >
                    <p>👍</p>
                    <p>좋아요</p>
                </button>
                <p>관심고객수 {count}</p>
            </div>

            <h2 className={styles.top__nav__logo}>
                <Link href={"/"}>
                    LOGO
                </Link>
            </h2>

            <div
                ref={dropdownRef}
                className={styles.top__nav__search}>
                <button
                    className={styles.top__nav__btn}
                    onClick={handleClick}>
                    <p>검색어를 입력해주세요</p>
                    <p>🔎</p>
                </button>

                {isClicked && <div className={styles.search__box}>
                    <div className={styles.search__input}>
                        <input
                            type={"search"}
                            value={name}
                            placeholder={" "}
                            onChange={(e) => {
                                setName(e.target.value);
                                setQuery(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={()=> query && setIsOpen(true)}
                            onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                        />
                        <label>검색</label>
                    </div>
                    {isOpen && results.length > 0 && (
                        <ul className={styles.search__dropdown}>
                            {results.map((item, index) => (
                                <li key={item.id}>{index}. {item.name}</li>
                            ))}
                        </ul>
                    )}
                </div>}

            </div>
        </nav>
    )
}