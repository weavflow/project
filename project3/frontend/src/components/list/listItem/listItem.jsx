import styles from "./listItem.module.css";
import AdList from "@/components/adList/adList";
import Carousel from "@/components/carousel/carousel";

export function BestListItem({list}) {
    return (
        <div className={styles.list}>
            {list.map((item) => (
                <div key={item.id} className={styles.list__item}>
                    <Carousel data={item.image} variant={"product"} offset={4}>
                        {item.image.map((img,i) => (
                            <img
                                key={img.id}
                                src={img.src}
                                alt={img.name}
                                loading={i === 0 ? "eager" : "lazy"}
                                decoding={i === 0 ? "sync" : "async"}
                            />
                        ))}
                    </Carousel>
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

export function DefaultListItem({list}) {
    const safe = list.length > 0 ? list : Array(4).fill(null);

    return (
        <div className={styles.list}>
            {safe.map((item, i) => {
                const images = Array.isArray(item?.image)
                    ? item.image
                    : item?.image
                        ? [item.image]
                        : [];

                return (
                    <div key={item?.id ?? i} className={styles.list__item}>
                        {item ? (
                            <>
                                <Carousel data={item} variant={"product"} offset={4}>
                                    {images.map((img,idx) => (
                                        <img
                                            key={img.id ?? idx}
                                            src={img.src ?? img}
                                            alt={img.name ?? "image"}
                                            loading={idx === 0 ? "eager" : "lazy"}
                                            decoding={idx === 0 ? "sync" : "async"}
                                        />
                                    ))}
                                </Carousel>
                                <h3 className={styles.item__title}>{item.name}</h3>
                            </>
                        ) : (
                            <div className={styles.skeleton}></div>
                        )}
                </div>
                )}
            )}
        </div>
    )
}

// 지금 발생한 문제는
// 초기 렌더 구조 불일치
// 즉, safe로 빈 데이터여도 DOM 구조를 유지시켜서 문제 해결은 되었으나
// 지금 이 구조에는 배열 안에 배열이 하나 더 있기 때문에
// item.image의 배열 구조가 성립되지 않으면 undefined 즉 .map()이 활성화되지 않음.
// 따라서 image의 구조를 항상 보정하는 방법을 사용하여 진행해야 함.
// const images = Array.isArray(item?.image) ? item.image : item?.image