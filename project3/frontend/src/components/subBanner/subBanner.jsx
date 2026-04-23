import {TYPE} from "@/data/type";

export default function SubBanner({type}) {
    const Banner = TYPE[type];

    return (
        <>
            {Banner && <Banner />}
        </>
    )
}