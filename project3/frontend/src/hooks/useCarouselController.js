"use client"
import {useState, useEffect, useRef, useMemo} from "react";
import CreateCloneList from "@/utils/createCloneList";
import useMoveTo from "@/hooks/useMoveTo";

// 수동 Slide 와 자동 Slide 를 동시에 같은 JSX 에서 구현하게 되면
// index, cloneList 등등 모든 것에서 공통된 부분이 존재하기 때문에
// 처음 이미지에서 이전 버튼으로 돌아가면 모든 동작이 불가능해지거나
// 마지막 이미지에서 다시 처음으로 돌아가는 것이 아닌 이상한 index 포인트로 이동하게 됨.

// 따라서 하나의 머신으로 공통된 부분을 만들고
// 거기서 mode 와 auto 의 분기점에 의해 수동, 자동, slide, opacity 로 나뉘어 지는 구조로 제작
// moveTo 역시 공통으로 쓰이기 때문에 공통 훅으로 분리 진행.

export default function useCarouselController(array, options) {
    const {mode, auto} = options;
    const isSlide = mode === "slide";
    // 이미지가 2개 이상 & 모드가 "slide" 일 때
    const isLoop = isSlide && array?.length >= 2;

    // 현재 보여줄 이미지 순서
    const [index, setIndex] = useState(isSlide ? 1 : 0);
    // 이전에 보여준 이미지 순서
    const [prevIndex, setPrevIndex] = useState(null);
    // 애니메이션 동작
    const [isTransition, setIsTransition] = useState(false);

    // 이동 중인지 여부 확인
    // 클릭 연타 혹은 중복 이동을 방지
    const isAnimatingRef = useRef(false);
    // 점프 예약
    const pendingJumpRef = useRef(null);
    // 안전 Unlock
    const fallbackRef = useRef(null);

    // 이동 트리거
    const moveTo = useMoveTo({
        array,
        pendingJumpRef,
        isAnimatingRef,
        setIndex,
        setPrevIndex,
        isSlide,
        fallbackRef
    });
    // slide 는 cloneList 가 필요하고, index 구조가 1 ~ n
    // fade 는 cloneList 가 필요 없고, index 구조가 0 ~ n-1
    // 또한 moveTo 에서 index 변환이 이루어 지기 때문에
    // slide or fade 를 알고 있어야 함.

    // mode 와 이미지 갯수가 2개 이하인 경우에 따라
    // cloneList 생성 금지
    const renderList = useMemo(() => {
        if (!isLoop) return array;
        return CreateCloneList(array);
    }, [array, isLoop]);

    const handleNext = () => {
        moveTo(prev => prev + 1, {force: true});
    }

    const handlePrev = () => {
        moveTo(prev => prev - 1, {force: true});
    }

    const handleIndicator = (i) => {
        if (isSlide) {
            moveTo(i + 1, {force: true});
        } else {
            moveTo(i, {force: true});
        }
    }

    const handleTransition = (e) => {
        if (e.target !== e.currentTarget) return;
        if (e.propertyName !== "transform" && e.propertyName !== "opacity") return;

        if (isSlide && pendingJumpRef.current !== null) {
            setIsTransition(false);
            setIndex(pendingJumpRef.current);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransition(true);
                    isAnimatingRef.current = false;
                    pendingJumpRef.current = null;
                });
            });

            return;
        }

        isAnimatingRef.current = false;
    }

    useEffect(() => {
        if (!array?.length) return;

        setIndex(isSlide ? 1 : 0);
        isAnimatingRef.current = false;
        pendingJumpRef.current = null;
    }, [array?.length, isSlide]);
    // mode 가 바뀌어도 index 는 초기화가 되지 않기 때문에
    // 무조건 mode 를 추가하여 slide <-> fade 전환에서 초기화가 실행되게끔 설계.

    useEffect(() => {
        const ref = requestAnimationFrame(() => {
            setIsTransition(true);
        })

        return () => cancelAnimationFrame(ref);
    }, []);

    // auto + fade 에서 UX 문제 중에 끊기는 증상이 발생할 수 있음.
    // 끝의 index 에서 다시 초기 index 로 점프하는 순간 발생.
    useEffect(() => {
        if (!auto || array?.length <= 1) return;

        const id = setInterval(() => {
            if (isSlide) {
                moveTo(prev => prev + 1, {force: true});
            } else {
                moveTo(prev => (prev + 1) % array?.length, {force: true});
            }
        }, 3000);

        return () => clearInterval(id);
    }, [auto, moveTo, isSlide, array?.length]);

    return {
        index,
        prevIndex,
        renderList,
        isTransition,
        handleNext,
        handlePrev,
        handleIndicator,
        handleTransition
    }
}