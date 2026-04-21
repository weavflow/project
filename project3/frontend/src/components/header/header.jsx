"use client"
import styles from './header.module.css';
import TopEnd from "@/components/topEnd/topEnd";
import TopNav from "@/components/topNav/topNav";
import BottomNav from "@/components/bottomNav/bottomNav";
import AdBanner from "@/components/adBanner/AdBanner";

export default function Header({hasAd = true}) {
    return (
        <header className={styles.shop__header} data-ad={hasAd}>
            <div className={styles.shop__header__ad}>
                {hasAd && <AdBanner />}
            </div>

            <TopEnd />

            <section className={styles.shop__header__nav}>
                <TopNav />
                <BottomNav />
            </section>
        </header>
    )
}