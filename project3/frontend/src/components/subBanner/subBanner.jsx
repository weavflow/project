import {TYPE} from "@/data/fileMap";
import styles from "./subBanner.module.css"

export function SubBanner({type}) {
    const Banner = TYPE[type];

    return (
        <>
            {Banner && <Banner />}
        </>
    )
}

export function BestSubBanner() {
    return (
        <div className={styles.best__info}>
            <p className={"text-sm"}><strong>서울시 강남구</strong> 도착기준</p>
            <p>배송 안내</p>
        </div>
    )
}

export function LiveSubBanner() {
    return (
        <div className={styles.live__info}>
            <p>Live 중</p>
        </div>
    )
}

export function ProductSubBanner() {
    return (
        <>
        </>
    )
}