import styles from "./best.module.css";
import BestList from "@/components/list/best/bestList";


export default function page() {


    return (
        <>
            <section className={styles.product__container}>
                <BestList />
            </section>
        </>
    )
}