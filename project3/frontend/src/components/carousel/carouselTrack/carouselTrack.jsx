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
                {renderList.map((child, i) => {
                    if (!child) return null;

                    const isActive = i === index;
                    const isPrev = i === prevIndex;

                    return (
                        <div
                            className={styles.fade__list__item}
                            key={`${i}`}
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
                                        : 0.2,
                                zIndex: isActive ? 2 : 1,

                                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease"
                            }}
                        >
                            {child}
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
            {renderList.map((child, i) => {
                if (!child) return null;

                return (
                    <div
                        className={styles.list__item}
                        key={`${i}`}
                    >
                        {child}
                    </div>
                )
            })}
        </div>
    )
}