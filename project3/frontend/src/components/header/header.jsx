"use client"
import styles from './header.module.css';
import TopEnd from "@/components/topEnd/topEnd";
import TopNav from "@/components/topNav/topNav";
import BottomNav from "@/components/bottomNav/bottomNav";
import AdBanner from "@/components/adBanner/AdBanner";
import Link from "next/link";
import {useState} from "react";
import Membership from "@/components/membership/membership";

export default function Header({hasAd = true}) {
    const [theme, setTheme] = useState({
        text: "black",
        color: "navy",
    })

    return (
        <header className={styles.shop__header} data-ad={hasAd}>
            <div className={styles.shop__header__ad}>
                <AdBanner onThemeChange={setTheme} hasAd={hasAd} />
                <Membership hasAd={hasAd} />
            </div>

            <TopEnd />

            <section className={styles.shop__header__nav}>
                <TopNav theme={theme} />
                <BottomNav theme={theme} />
            </section>
        </header>
    )
}