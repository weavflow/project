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

export default function AdBanner() {
    // ad 데이터 & 에러
    const [ad, setAd] = useState([]);
    const [error, setError] = useState(null);

    // 현재 보여줄 ad 이미지 순서
    const [index, setIndex] = useState(1);
    // 애니메이션 동작
    const [isTransition, setIsTransition] = useState(true);

    // 데이터 불러오기 query
    const type = "ad";
    // 이벤트 기준 DOM 접근용
    const trackRef = useRef(null);
    // 이벤트 발생 중 입력 막기
    const isAnimatingRef = useRef(false);
    // 버튼 클릭 시 autoplay 리셋
    const intervalRef = useRef(null);

    // 데이터 불러오기
    useEffect(() => {
        setError(null);
        LoadData(setAd, setError, type);
    }, [type]);

    // 클론 배열
    // 원본 : [A, B]
    // 렌더링 : [B, A, B, A]
    // index:   0  1  2  3
    const adList = 
        ad.length > 0
            ? [ad[ad.length - 1], ...ad, ad[0]]
            : [];
    // 왼쪽과 오른쪽 끝에서 자연스럽게 이전&다음으로 움직이는게 가능
    // 단, index 0, 4은 가짜 위치이기 때문에 다시 진짜 위치로 점프가 필요함.

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
    // 범위를 Math.min & max로 [0 ~ ad.length + 1]로 제한함.
    // clone 영역까지 포함

    // 끝 <-> 처음 이동처리
    const handleTransition = () => {
        if (!isTransition) return;

        if (index === 0) {
            setIsTransition(false);
            setIndex(ad.length);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransition(true);
                    isAnimatingRef.current = false;
                });
            });

            return;
        }

        if (index === ad.length + 1) {
            setIsTransition(false);
            setIndex(1);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransition(true);
                    isAnimatingRef.current = false;
                });
            });

            return;
        }

        isAnimatingRef.current = false;
    }
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

        setIndex(prev =>
            typeof next === "function" ? next(prev) : next
        );
    }

    const handleIndicator = (i) => {
        stopAutoSlide();
        moveTo(i + 1);
        startAutoSlide();
    }

    const startAutoSlide = () => {
        stopAutoSlide();

        intervalRef.current = setInterval(() => {
            moveTo(prev => (prev + 1));
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
            setIndex(1);
        }
    }, [ad.length]);
    // 첫 번째는 클론이 아닌 진짜 데이터부터 시작해야 하기 때문에
    // 초기값을 무조건 보정해주어야 함.

    // 클론을 포함하여 실제 인덱스 찾기
    const currentIndex =
        ad.length > 0
            ? (index - 1 + ad.length) % ad.length
            : 0;

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
            <div
                ref={trackRef}
                className={styles.ad__track}
                onTransitionEnd={handleTransition}
                style={{
                    transform: `translateX(-${index * 100}%)`,
                    transition: isTransition ? "transform 0.8s ease-out" : "none",
                    willChange: isTransition ? "transform": "auto",
                }}
            >
                {adList.map((item, i) => {
                    if (!item) return null;

                    const isFirst = i === 1;
                    
                    return (
                        <img
                        key={i}
                        className={styles.ad__image}
                        src={item.image}
                        alt={item.name}
                        loading={isFirst ? "eager" : "lazy"}
                        decoding={isFirst ? "sync" : "async"}
                        />
                    );
                })}
            </div>

            <Indicator
                array={ad}
                current={currentIndex}
                onChange={handleIndicator}
            />

            <button
                className={styles.ad__prev}
                onClick={handlePrev}
            >이전</button>

            <button
                className={styles.ad__next}
                onClick={handleNext}
            >다음</button>
        </div>
    )
}