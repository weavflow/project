import Carousel from "@/components/carousel/carousel";

export default function AdList({list}) {
    return (
        <>
            {/* 수동 무한 슬라이드 기본 값 mode={"slide} auto={false} */}
            <Carousel data={list} variant={"list"} offset={12}>
                {list.map((item, i) => (
                    <img
                        key={item.id}
                        src={item.src}
                        alt={item.name}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding={i === 0 ? "sync" : "async"}
                    />
                ))}
            </Carousel>
            {/* 자동 무한 슬라이드 auto=true */}
            <Carousel data={list} variant={"list"} auto={true} offset={12}>
                {list.map((item, i) => (
                    <img
                        key={item.id}
                        src={item.src}
                        alt={item.name}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding={i === 0 ? "sync" : "async"}
                    />
                ))}
            </Carousel>
            <Carousel data={list} variant={"list"} mode={"fade"} offset={12}>
                {list.map((item, i) => (
                    <img
                        key={item.id}
                        src={item.src}
                        alt={item.name}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding={i === 0 ? "sync" : "async"}
                    />
                ))}
            </Carousel>
        </>
    )
}