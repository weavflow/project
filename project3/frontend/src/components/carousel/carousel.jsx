"use client"
import styles from "./carousel.module.css";
import {Children, useEffect} from "react";
import useCarouselController from "@/hooks/useCarouselController";
import CreateCurrentIndex from "@/utils/createCurrentIndex";
import InternalButton from "@/components/carousel/internalButton/internalButton";
import CarouselTrack from "@/components/carousel/carouselTrack/carouselTrack";

export default function Carousel(
    {
        data,
        children,
        mode = "slide",
        auto = false,
        variant = "default",
        offset,
        onIndexChange
    }) {
    const items = Children.toArray(children);
    const isSingle = items.length <= 1;
    const controller = useCarouselController(items, {mode, auto});
    const currentIndex = CreateCurrentIndex({
        length: items.length,
        index: controller.index,
        mode
    });

    useEffect(() => {
        onIndexChange?.(controller.index)
    }, [controller.index]);

    return (
        <div className={`${styles.list__wrapper} ${styles[variant]}`}>
           {isSingle ? (
            <div className={styles.single__item}>
                {items[0]}
            </div>
        ) : (
            <>
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
                        data={data}
                        index={currentIndex}
                        onChange={controller.handleIndicator}
                        Prev={controller.handlePrev}
                        Next={controller.handleNext}
                        offset={offset}
                    />
                )}
            </>
        )}
        </div>
    )
}

// Carousel
// 현재 구조는 Carousel과 Track을 공통으로 쓰기 위해서
// children을 받는 구조로 설계.
// 문제는 children을 받는 구조로 설계할 경우
// Internal React error: Expected static flag was missing.
// 초기 렌더 불일치 및 static tree 깨짐 증상이 발생함.
// Client 컴포넌트에서 초기 렌더 -> 이후 렌더에서 데이터 구조가 달라지면서 생기는 문제

// 이 구조를 기준으로 설명하면
// ListContainer쪽에서 LoadData를 진행하면서 첫번째에는 빈 데이터였다면
// 두번째에서는 데이터가 있는 구조가 되면서
// 첫번째와 다르게 두번째에 DOM 구조가 생성됨에 따라 초기 렌더 불일치라고 오류가 뜨는 문제가 발생함.
// 이를 해결하기 위해선
// 1. 초기에 빈 데이터일 때에도 리스트 구조 고정
// const SAFE = list.length > 0 ? list : Array(4).fill(null);

// 2. 로딩 상태 추가와 LoadData(...)에서 setIsLoading() 진행.
// {isLoading && <Skelton /> : renderListItem(ui, list)}