import styles from "./best.module.css";
import BestList from "@/components/list/best/bestList";


export default function page() {
    return (
        <>
            <div className={styles.product__container}>
                <BestList />
            </div>
        </>
    )
}