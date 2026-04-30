import styles from "./listItem.module.css";
import AdList from "@/components/adList/adList";
import Carousel from "@/components/carousel/carousel";

export function BestListItem({list}) {
    return (
        <div className={styles.list}>
            {list.map((item) => (
                <div key={item.id} className={styles.list__item}>
                    <Carousel list={item.image.map(img => ({
                        id: img.id,
                        src: img.src,
                        name: img.name
                    }))} />
                    <h3 className={styles.item__title}>{item.name}</h3>
                    <p className={styles.item__price}>{item.price}원</p>
                    <p className={styles.item__cart}>장바구니 담기</p>
                </div>
            ))}
        </div>
    )
}

export function LiveListItem({list}) {
    return (
        <div className={styles.list}>
            {list.map((item) => (
                <div key={item.id} className={styles.list__item}>
                    <img src={item.image} alt={item.name} />
                    <h3 className={styles.item__title}>{item.name}</h3>
                </div>
            ))}
        </div>
    )
}

export function AdListItem({list}) {
    return (
        <AdList list={list} />
    )
}