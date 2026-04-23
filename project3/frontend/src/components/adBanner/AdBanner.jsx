"use client"
import {useState, useEffect, useRef} from "react";
import LoadData from "@/lib/loadData";
import styles from "./AdBanner.module.css";
import Indicator from "@/components/indicator/indicator";

// 무한 캐러셀 + transition 이벤트 제어
// index 변경
// -> transform 이동 (transition on)
// -> transition 끝 (onTransitionEnd)
// -> clone 위치인지 검사
// -> transition off + index 점프
// -> 다음 순서에서 transition on

export default function AdBanner({onThemeChange}) {
    // ad 데이터 & 에러
    const [ad, setAd] = useState([]);
    const [error, setError] = useState(null);

    // 현재 보여줄 ad 이미지 순서
    const [index, setIndex] = useState(0);
    // 이전 ad 이미지 순서
    const [prevIndex, setPrevIndex] = useState(null);

    // 데이터 불러오기 query
    const type = "ad";
    // 이벤트 기준 DOM 접근용
    const trackRef = useRef(null);
    // 이벤트 발생 중 입력 막기
    const isAnimatingRef = useRef(false);
    // 버튼 클릭 시 autoplay 리셋
    const intervalRef = useRef(null);
    // 애니메이션 동작 감지
    const transitionRef = useRef([]);

    // 데이터 불러오기
    useEffect(() => {
        setError(null);
        LoadData(setAd, setError, type);
    }, [type]);

    // 클론 배열
    // 원본 : [A, B]
    // 렌더링 : [B, A, B, A]
    // index:   0  1  2  3
    // const adList =
    //     ad.length > 0
    //         ? [ad[ad.length - 1], ...ad, ad[0]]
    //         : [];
    // 왼쪽과 오른쪽 끝에서 자연스럽게 이전&다음으로 움직이는게 가능
    // 단, index 0, 4은 가짜 위치이기 때문에 다시 진짜 위치로 점프가 필요함.
    // 해당 배열은 무한 슬라이드 이동인 경우에 쓰이고, 페이드 이동인 경우엔 쓰이지 않음.

    // 이전 & 다음 버튼
    const handlePrev = () => {
        stopAutoSlide()
        moveTo(index - 1);
        startAutoSlide()
    }
    const handleNext = () => {
        stopAutoSlide()
        moveTo(index + 1);
        startAutoSlide()
    }

    const handleTransitionEnd = (i) => (e) => {
        // 현재 애니메이션 적용된 요소
        if (i !== index) return;
        // opacity 기준으로만 사용
        if (e.propertyName !== "opacity") return;
        // 현재 ref를 기준으로 이벤트는 1번만 받기
        if (!isAnimatingRef.current) return;

        isAnimatingRef.current = false;
    }

    // 끝 <-> 처음 이동처리
    // const handleTransition = () => {
    //     if (!isTransition) return;
    //
    //     if (index === 0) {
    //         setIsTransition(false);
    //         setIndex(ad.length);
    //
    //         requestAnimationFrame(() => {
    //             requestAnimationFrame(() => {
    //                 setIsTransition(true);
    //                 isAnimatingRef.current = false;
    //             });
    //         });
    //
    //         return;
    //     }
    //
    //     if (index === ad.length + 1) {
    //         setIsTransition(false);
    //         setIndex(1);
    //
    //         requestAnimationFrame(() => {
    //             requestAnimationFrame(() => {
    //                 setIsTransition(true);
    //                 isAnimatingRef.current = false;
    //             });
    //         });
    //
    //         return;
    //     }
    //
    //     isAnimatingRef.current = false;
    // }
    // 왼쪽으로 계속 이동 = index : 1 -> 0 (C의 clone)
    // 그 다음 0 (C의 clone) -> ad.length (C)
    // transition 없이 순간이동으로 진짜 위치로 점프하는 부분
    // 사용자에 렌더링되지 않기 때문에 무한 루프처럼 보여지게 됨.
    // 기존의 setTimeout으로 진행하게 되면
    // 2 -> 1로 넘어가는 순간에 애니메이션이 빨리감기가 된 것 처럼 보여지게됨.

    // 애니매이션 초기화, useRef를 통한 이벤트 DOM 기준으로 이미지가 움직이는 과정에서
    // 발생하는 현상인 애니메이션 스킵 현상에 대해서 보정이 되었으나
    // 문제는 자동 슬라이드 중에 이전&다음 버튼을 클릭하여 움직일 경우
    // 같은 문제가 발생함을 확인함.

    // 자동 슬라이드 + 이전&다음 버튼 클릭 + trainsitionEnd로직의 index 꼬임 증상
    const moveTo = (next) => {
        if (isAnimatingRef.current) return;

        isAnimatingRef.current = true;

        setIndex(prev => {
            const nextIndex =
                typeof next === "function" ? next(prev) : next

            setPrevIndex(prev);

            return (nextIndex + ad.length) % ad.length;
        });
    }

    const handleIndicator = (i) => {
        stopAutoSlide();
        moveTo(i + 1);
        startAutoSlide();
    }

    const startAutoSlide = () => {
        stopAutoSlide();

        intervalRef.current = setInterval(() => {
            moveTo(prev => prev + 1);
        }, 3000);
    };

    const stopAutoSlide = () => {
        clearInterval(intervalRef.current);
    }

    // 애니메이션 초기화
    // useEffect(() => {
    //     if (!isTransition) {
    //         requestAnimationFrame(() => {
    //             requestAnimationFrame(() => {
    //                 setIsTransition(true);
    //             });
    //         });
    //     }
    // }, [isTransition])
    // requestAnimationFrame를 두번 처리하는 이유
    // 첫 번째 DOM 변경 반영
    // 두 번째 브라우저 paint 완료
    // 만약 해당 코드가 존재하지 않으면
    // transition off가 동작하지 않아 튀는 현상이 발생함.

    // 자동 슬라이드
    useEffect(() => {
        if (!ad.length) return;

        startAutoSlide();

        return () => stopAutoSlide();
    }, [ad.length]);
    
    // 초기값 보정
    useEffect(() => {
        if (ad.length > 0) {
            setIndex(0);
        }
    }, [ad.length]);
    // 첫 번째는 클론이 아닌 진짜 데이터부터 시작해야 하기 때문에
    // 초기값을 무조건 보정해주어야 함.

    // 클론을 포함하여 실제 인덱스 찾기
    // const currentIndex =
    //     ad.length > 0
    //         ? (index - 1 + ad.length) % ad.length
    //         : 0;
    // 슬라이드 이동 애니메이션이 아닌
    // 페이드 애니메이션이라면 실제 index로 그대로 사용

    // 광고별 테마
    useEffect(() => {
        if (!ad.length) return;
        const theme = ad[index]?.theme;

        if (theme) {
            onThemeChange(theme);
        }

    }, [index, ad]);

    if (error) return <>{error.message}</>;

    /* loading="lazy"
       네트워크 + 렌더링 타이밍 최적화
         1. 초기 로딩 성능 개선
            * 초기 HTML 파싱 시 이미지 요청이 줄어듦
            * TTFB 이후 네트워크 경쟁 감소
            * LCP(최대 콘텐츠 렌더링) 개선
         2. 메모리 사용 감소
         3. 스크롤 성능 개선
         4. 단점은 이미지 렌더링 지연
       현재 구조인 이미지 슬라이드에는 첫 번째 이미지 슬라이드에선 쓰면 안됨.

       decoding="async"
       메인 스레드 블로킹 방지
       이미지 디코딩 타이밍을 브라우저에게 위임하는 속성
         1. UI 끊김 감소
            * JS 실행 / 애니메이션과 디코딩을 분리
         2. 프레임 드랍 방지
         3. 단점은 디코딩 완료 시점 보장 불가
       현재 구조인 이미지 슬라이드의 첫 번째 이미지 슬라이드에선 쓰면 안됨.

       따라서 첫 번째가 아닌 2, 3번째와 본문 이미지에 적용을 시켜야 하며
       첫 번째 이미지에 적용할 경우 렌더링 지연과 디코딩 완료 시점 보장 불가로 인해
       페이지가 열리고 이미지가 바로 보이지 않는 현상이 발생할 수 있다.
    */
    return (
        <div className={styles.ad__wrapper}>
            {/*  항상 왼쪽으로 이동 하는 애니메이션  */}
            {/* 만약에 scale와 opacity으로 index이동을 애니메이션으로 하게 되면
                ad__track의 style는 자동적으로 주석처리 혹은 비활성화를 진행해야 하며
                활성화가 되어 있는 경우 애니메이션 충돌이 나면서 이미지가 보이지 않게 됨.
             */}
            <div
                ref={trackRef}
                className={styles.ad__track}
                // onTransitionEnd={handleTransition}
                // style={{
                //     transform: `translate3d(0, -${index * 100}%, 0)`,
                //     transition: isTransition ? "transform 0.8s ease-out" : "none",
                //     willChange: isTransition ? "transform": "auto",
                // }}
                // 애니메이션 이중 충돌로 인한 주석 처리
            >
                {ad.map((item, i) => {
                    if (!item) return null;

                    const isFirst = i === 1;
                    
                    return (
                        <div
                            key={i}
                            ref={e => transitionRef.current[i] = e}
                            className={styles.ad__image}
                            onTransitionEnd={handleTransitionEnd(i)}
                            style={{
                                transform: i === index
                                    ? "scale(1)"
                                    : i === prevIndex
                                        ? "scale(1.15)"
                                        : "scale(0.95)",
                                opacity: i === index
                                    ? 1
                                    : i === prevIndex
                                        ? 0.2
                                        : 0.2,
                                zIndex: i === index ? 2 : 1,
                                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease"
                            }}
                        >
                            <img
                            key={i}
                            className={styles.ad__item}
                            src={item.image}
                            alt={item.name}
                            loading={isFirst ? "eager" : "lazy"}
                            decoding={isFirst ? "sync" : "async"}
                            />
                        </div>
                    );
                })}
            </div>

            <Indicator
                array={ad}
                current={index}
                onChange={handleIndicator}
            />

            <button
                className={styles.ad__prev}
                onClick={handlePrev}
                style={{
                    color: ad[index]?.theme.text
                }}
            >이전</button>

            <button
                className={styles.ad__next}
                onClick={handleNext}
                style={{
                    color: ad[index]?.theme.text
                }}
            >다음</button>
        </div>
    )
}