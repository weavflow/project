"use client"
import {useState, useEffect, useRef} from "react";
import LoadData from "@/lib/loadData";
import styles from "./AdBanner.module.css";
import Indicator from "@/components/indicator/indicator";

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
    useEffect( () => {
        let isMounted = true;

        setError(null);
        LoadData(
            (data) => isMounted && setAd(data),
            (err) => isMounted && setError(err),
            type
        );

        return () => {
            isMounted = false;
        };
    }, [type]);

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
        if (i !== index && i !== prevIndex) return;
        // opacity & transform 기준
        if (e.propertyName !== "opacity" && e.propertyName !== "transform") return;
        // 현재 ref를 기준으로 이벤트는 1번만 받기
        if (!isAnimatingRef.current) return;

        requestAnimationFrame(() => {
            if (isAnimatingRef.current) {
                isAnimatingRef.current = false;
            }
        });
    }

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
        moveTo(i);
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
            <div
                ref={trackRef}
                className={styles.ad__track}
            >
                {ad.map((item, i) => {
                    if (!item) return null;

                    const isFirst = i === 1;
                    
                    return (
                        <div
                            key={`${item.id}-${i}`}
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
                            className={styles.ad__item}
                            src={item.src}
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
                    color: ad[index]?.theme.text ?? "#fff"
                }}
            >{"<"}</button>

            <button
                className={styles.ad__next}
                onClick={handleNext}
                style={{
                    color: ad[index]?.theme.text ?? "#fff"
                }}
            >{">"}</button>
        </div>
    )
}