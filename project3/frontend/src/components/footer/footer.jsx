import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.shop__footer}>
            <section className={styles.shop__ft__section}>
                <ul className={styles.shop__ft__list}>
                    <li>Tel. 010-2603-7468</li>
                    <li>Email : considerate76@gmail.com</li>
                    <li>
                        Github : <a href={"https://github.com/weavflow"} target={"_blank"} rel={"noopener noreferrer"}>
                             @weavflow
                        </a>
                    </li>
                    <li>©Make WeavFlow</li>
                </ul>
            </section>
        </footer>
    )
}