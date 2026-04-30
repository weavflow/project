import List from "@/components/list/list";
import navData from "@/data/nav.json"

function findNav(type) {
    return navData.find(item => item.type === type);
}

export default async function Page({params}) {
    const {type} = await params;
    console.log(type);

    const nav = findNav(type);
    const label = nav?.label ?? "";

    return (
        <List label={label} type={type} ui={nav?.ui ?? "default"}/>
    )
}