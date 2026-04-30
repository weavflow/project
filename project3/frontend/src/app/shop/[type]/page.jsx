import {LIST} from "@/data/fileMap";
import navData from "@/data/nav.json"

function findNav(type) {
    return navData.find(item => item.type === type);
}

export default async function Page({params}) {
    const {type} = await params;

    const List = LIST[type];
    const nav = findNav(type);
    const label = nav?.label ?? "";

    if (!List) {
        return <>존재하지 않는 페이지입니다.</>
    }

    return (
        <List label={label} type={type} />
    )
}