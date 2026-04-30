import styles from './carouselTrack.module.css';

export default function CarouselTrack(
    {
        mode,
        index,
        prevIndex,
        renderList,
        isTransition,
        onTransitionEnd
    }) {
    if (mode === "fade") {
        return (
            <div
                className={styles.fade__list__track}
                onTransitionEnd={onTransitionEnd}
            >
                {renderList.map((item, i) => {
                    if (!item) return null;

                    const isActive = i === index;
                    const isPrev = i === prevIndex;
                    const isFirst = mode === "slide" ? i === 1 : i === 0;

                    return (
                        <div
                            className={styles.fade__list__item}
                            key={`${item.id}-${i}`}
                            style={{
                                transform: isActive
                                    ? "scale(1)"
                                    : isPrev
                                        ? "scale(1.15)"
                                        : "scale(0.95)",
                                opacity: isActive
                                    ? 1
                                    : isPrev
                                        ? 0.4
                                        : 0.4,
                                zIndex: isActive ? 2 : isPrev ? 1 : 0,

                                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease"
                            }}
                        >
                            <img
                                className={styles.list__item__image}
                                src={item.src}
                                alt={item.name}
                                loading={isFirst ? "eager" : "lazy"}
                                decoding={isFirst ? "sync" : "async"}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div
            className={styles.list__track}
            onTransitionEnd={onTransitionEnd}
            style={{
                transform: `translateX(-${index * 100}%)`,
                transition: isTransition ? "transform 0.8s ease-out" : "none",
            }}
        >
            {renderList.map((item, i) => {
                if (!item) return null;

                const isFirst = mode === "slide" ? i === 1 : i === 0;

                return (
                    <div
                        className={styles.list__item}
                        key={`${item.id}-${i}`}
                    >
                        <img
                            className={styles.list__item__image}
                            src={item.src}
                            alt={item.name}
                            loading={isFirst ? "eager" : "lazy"}
                            decoding={isFirst ? "sync" : "async"}
                        />
                    </div>
                )
            })}
        </div>
    )
}