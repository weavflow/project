"use client"
import {useState, useEffect, useRef} from "react";
import Carousel from "@/components/carousel/carousel";
import LoadData from "@/lib/loadData";
import styles from "./AdBanner.module.css";
import Indicator from "@/components/indicator/indicator";

export default function AdBanner({onThemeChange, hasAd}) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [mounted, setMounted] = useState(true);
    const [index, setIndex] = useState(0);

    const SAFE_INDEX = index === 0
        ? data.length - 1
        : index === data.length + 1
            ? 0
            : index - 1;

    useEffect(() => {
        if (!hasAd) return;

        setMounted(true);
        let isMounted = true;
        setError(null);

        LoadData(
            (data) => {
                if (!isMounted) return;
                setData(data);
            },
            (err) => {
                if (!isMounted) return;
                setError(err);
            },
            "ad"
        );

        return () => {
            isMounted = false;
        };
    }, [hasAd]);

    // 광고별 테마
    useEffect(() => {
        if (!data.length) return;
        const theme = data[index]?.theme;

        if (theme) {
            onThemeChange(theme);
        }

    }, [index, data]);

    // 광고 허용이 아니라면 렌더 금지
    if (!hasAd) return null;

    // SSR 상태에선 렌더 금지
    if (!mounted) return null;

    // 데이터 없으면 렌더 금지
    if (data.length === 0) return null;

    return (
        <Carousel data={data} variant={"main"} mode={"fade"} auto={true} offset={80} onIndexChange={setIndex}>
            {data.map((item, i) => (
                <img
                    key={item.id}
                    src={item.src}
                    alt={item.name}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding={i === 0 ? "sync" : "async"}
                />
            ))}
        </Carousel>
    )
}

// 여기에서도 ListContainer때와 마찬가지로
// 초기 렌더 불일치 문제가 발생함.
// 보통은 List보다 Header에서 더 자주 발생하며
// Header의 경우 보통 Layout쪽에서 렌더되기 때문에 발생 빈도 수가 높음.
// 문제는 보통 Header의 경우 메인페이지에서 쓰는 구조가 더 많기 때문에
// List때와는 다른 방안으로 진행을 해야 함.

// 메인 페이지에서 빈 구조 혹은 스켈레톤 구조를 진행하면 UI/UX적으로 너무 이상하게
// 변하기 때문에 오히려 이 구조에선 렌더를 지연시키는 방법으로 진행하는 편이 더 좋음.
// 단순하게 if (isLoading) return null; 으로 진행하면
// SSR(서버) : CSR(클라이언트) 렌더 결과 불일치 문제가 또 발생할 수 있음.

// 따라서 Carousel을 클라이언트에서 마운트된 이후에만 렌더링
// 하지만 단점으로는 마운트되기 전까지는 배너가 없다는 단점이 생김.

// 또한, 지금 이 문제가 발생하는 주요 원인은
// 현재 이 구조의 데이터를 불러오는 방식 자체가 서버 fetch 방식을 쓰지 않는 상태이기 때문에
// 실제 서버 fetch를 진행하게 되면 client fetch는 진행하지 않음.

// useCarouselController을 머신처럼 사용하여 구현하고자 목표

// export default function AdBanner({onThemeChange}) {
//     // ad 데이터 & 에러
//     const [ad, setAd] = useState([]);
//     const [error, setError] = useState(null);
//
//     // 현재 보여줄 ad 이미지 순서
//     const [index, setIndex] = useState(0);
//     // 이전 ad 이미지 순서
//     const [prevIndex, setPrevIndex] = useState(null);
//
//     // 데이터 불러오기 query
//     const type = "ad";
//     // 이벤트 기준 DOM 접근용
//     const trackRef = useRef(null);
//     // 이벤트 발생 중 입력 막기
//     const isAnimatingRef = useRef(false);
//     // 버튼 클릭 시 autoplay 리셋
//     const intervalRef = useRef(null);
//     // 애니메이션 동작 감지
//     const transitionRef = useRef([]);
//
//     // 데이터 불러오기
//     useEffect( () => {
//         let isMounted = true;
//
//         setError(null);
//         LoadData(
//             (data) => isMounted && setAd(data),
//             (err) => isMounted && setError(err),
//             type
//         );
//
//         return () => {
//             isMounted = false;
//         };
//     }, [type]);
//
//     // 이전 & 다음 버튼
//     const handlePrev = () => {
//         stopAutoSlide()
//         moveTo(index - 1);
//         startAutoSlide()
//     }
//     const handleNext = () => {
//         stopAutoSlide()
//         moveTo(index + 1);
//         startAutoSlide()
//     }
//
//     const handleTransitionEnd = (i) => (e) => {
//         // 현재 애니메이션 적용된 요소
//         if (i !== index && i !== prevIndex) return;
//         // opacity & transform 기준
//         if (e.propertyName !== "opacity" && e.propertyName !== "transform") return;
//         // 현재 ref를 기준으로 이벤트는 1번만 받기
//         if (!isAnimatingRef.current) return;
//
//         requestAnimationFrame(() => {
//             if (isAnimatingRef.current) {
//                 isAnimatingRef.current = false;
//             }
//         });
//     }
//
//     // 자동 슬라이드 + 이전&다음 버튼 클릭 + trainsitionEnd로직의 index 꼬임 증상
//     const moveTo = (next) => {
//         if (isAnimatingRef.current) return;
//
//         isAnimatingRef.current = true;
//
//         setIndex(prev => {
//             const nextIndex =
//                 typeof next === "function" ? next(prev) : next
//
//             setPrevIndex(prev);
//
//             return (nextIndex + ad.length) % ad.length;
//         });
//     }
//
//     const handleIndicator = (i) => {
//         stopAutoSlide();
//         moveTo(i);
//         startAutoSlide();
//     }
//
//     const startAutoSlide = () => {
//         stopAutoSlide();
//
//         intervalRef.current = setInterval(() => {
//             moveTo(prev => prev + 1);
//         }, 3000);
//     };
//
//     const stopAutoSlide = () => {
//         clearInterval(intervalRef.current);
//     }
//
//     // 자동 슬라이드
//     useEffect(() => {
//         if (!ad.length) return;
//
//         startAutoSlide();
//
//         return () => stopAutoSlide();
//     }, [ad.length]);
//
//     // 초기값 보정
//     useEffect(() => {
//         if (ad.length > 0) {
//             setIndex(0);
//         }
//     }, [ad.length]);
//
//     // 광고별 테마
//     useEffect(() => {
//         if (!ad.length) return;
//         const theme = ad[index]?.theme;
//
//         if (theme) {
//             onThemeChange(theme);
//         }
//
//     }, [index, ad]);
//
//     if (error) return <>{error.message}</>;
//
//     /* loading="lazy"
//        네트워크 + 렌더링 타이밍 최적화
//          1. 초기 로딩 성능 개선
//             * 초기 HTML 파싱 시 이미지 요청이 줄어듦
//             * TTFB 이후 네트워크 경쟁 감소
//             * LCP(최대 콘텐츠 렌더링) 개선
//          2. 메모리 사용 감소
//          3. 스크롤 성능 개선
//          4. 단점은 이미지 렌더링 지연
//        현재 구조인 이미지 슬라이드에는 첫 번째 이미지 슬라이드에선 쓰면 안됨.
//
//        decoding="async"
//        메인 스레드 블로킹 방지
//        이미지 디코딩 타이밍을 브라우저에게 위임하는 속성
//          1. UI 끊김 감소
//             * JS 실행 / 애니메이션과 디코딩을 분리
//          2. 프레임 드랍 방지
//          3. 단점은 디코딩 완료 시점 보장 불가
//        현재 구조인 이미지 슬라이드의 첫 번째 이미지 슬라이드에선 쓰면 안됨.
//
//        따라서 첫 번째가 아닌 2, 3번째와 본문 이미지에 적용을 시켜야 하며
//        첫 번째 이미지에 적용할 경우 렌더링 지연과 디코딩 완료 시점 보장 불가로 인해
//        페이지가 열리고 이미지가 바로 보이지 않는 현상이 발생할 수 있다.
//     */
//     return (
//         <div className={styles.ad__wrapper}>
//             <div
//                 ref={trackRef}
//                 className={styles.ad__track}
//             >
//                 {ad.map((item, i) => {
//                     if (!item) return null;
//
//                     const isFirst = i === 1;
//
//                     return (
//                         <div
//                             key={`${item.id}-${i}`}
//                             ref={e => transitionRef.current[i] = e}
//                             className={styles.ad__image}
//                             onTransitionEnd={handleTransitionEnd(i)}
//                             style={{
//                                 transform: i === index
//                                     ? "scale(1)"
//                                     : i === prevIndex
//                                         ? "scale(1.15)"
//                                         : "scale(0.95)",
//                                 opacity: i === index
//                                     ? 1
//                                     : i === prevIndex
//                                         ? 0.2
//                                         : 0.2,
//                                 zIndex: i === index ? 2 : 1,
//                                 transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease"
//                             }}
//                         >
//                             <img
//                             className={styles.ad__item}
//                             src={item.src}
//                             alt={item.name}
//                             loading={isFirst ? "eager" : "lazy"}
//                             decoding={isFirst ? "sync" : "async"}
//                             />
//                         </div>
//                     );
//                 })}
//             </div>
//
//             <Indicator
//                 array={ad}
//                 current={index}
//                 onChange={handleIndicator}
//             />
//
//             <button
//                 className={styles.ad__prev}
//                 onClick={handlePrev}
//                 style={{
//                     color: ad[index]?.theme.text ?? "#fff"
//                 }}
//             >{"<"}</button>
//
//             <button
//                 className={styles.ad__next}
//                 onClick={handleNext}
//                 style={{
//                     color: ad[index]?.theme.text ?? "#fff"
//                 }}
//             >{">"}</button>
//         </div>
//     )
// }