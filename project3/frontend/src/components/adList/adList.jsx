import Carousel from "@/components/carousel/carousel";

export default function AdList({list}) {
    console.log(list);

    return (
        <>
            {/* 수동 무한 슬라이드 기본 값 mode={"slide} auto={false} */}
            <Carousel list={list} offset={12}/>
            {/* 자동 무한 슬라이드 auto=true */}
            <Carousel list={list} auto={true} offset={12} />
            <Carousel list={list} mode={"fade"} offset={12} />
        </>
    )
}