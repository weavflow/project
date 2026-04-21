import styles from './subHeader.module.css';
import TopEnd from "@/components/topEnd/topEnd";
import TopNav from "@/components/topNav/topNav";
import BottomNav from "@/components/bottomNav/bottomNav";

export default function SubHeader() {
    return (
        <header className={styles.shop__header}>
            <TopEnd />
            <section className={styles.shop__header__nav}>
                <TopNav />
                <BottomNav />
            </section>
        </header>
    )
}