import styles from "./footer.module.css";

// 하단부
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <section className={styles.ft__section}>
                <ul className={styles.ft__list__left}>
                    <li>Email : considerate76@gmail.com</li>
                    <li><a href={"https://github.com/weavflow"} target={"_blank"} rel={"noopener noreferrer"}>
                        GitHub : @weavflow
                        </a>
                    </li>
                </ul>
                <ul className={styles.ft__list__right}>
                    <li>Tel. 010-2603-7468</li>
                    <li>©Make WeavFlow</li>
                </ul>
            </section>
        </footer>
    )
}