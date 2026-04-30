import styles from "./membership.module.css";
import Link from "next/link";

export default function Membership({hasAd}) {
    if (!hasAd) return null;

    return (
        <div className={styles.shop__membership} hidden={!hasAd}>
            <Link href={"#"}>멤버십 안내</Link>
        </div>
    )
}