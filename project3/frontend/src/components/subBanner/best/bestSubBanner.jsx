import styles from "./bestSubBanner.module.css";

export default function BestSubBanner() {
    return (
        <div className={styles.product__info}>
            <p className={"text-sm"}><strong>서울시 강남구</strong> 도착기준</p>
            <p>배송 안내</p>
        </div>
    )
}