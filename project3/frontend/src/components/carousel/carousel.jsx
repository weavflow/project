import styles from "./carousel.module.css";
import useCarouselController from "@/hooks/useCarouselController";
import CreateCurrentIndex from "@/utils/createCurrentIndex";
import InternalButton from "@/components/carousel/internalButton/internalButton";
import CarouselTrack from "@/components/carousel/carouselTrack/carouselTrack";

export default function Carousel({list, mode = 'slide', auto = false, offset}) {
    const isSingle = list.length <= 1;
    const controller = useCarouselController(list, {mode, auto});
    const currentIndex = CreateCurrentIndex({
        length: list.length,
        index: controller.index
    })

    return (
        <div className={styles.list__wrapper}>
            <CarouselTrack
                mode={mode}
                index={controller.index}
                prevIndex={controller.prevIndex}
                renderList={controller.renderList}
                isTransition={controller.isTransition}
                onTransitionEnd={controller.handleTransition}
            />

            {!isSingle && (
                <InternalButton
                    array={list}
                    index={currentIndex}
                    onChange={controller.handleIndicator}
                    Prev={controller.handlePrev}
                    Next={controller.handleNext}
                    offset={offset}
                />
            )}
        </div>
    )
}